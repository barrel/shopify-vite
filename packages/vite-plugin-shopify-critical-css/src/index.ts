import { Plugin } from 'vite'
import fs from 'fs';
import path from 'path';
import Crittr from 'crittr'
import { resolveConfig } from './config'
import type { Config } from './types'

const generateCriticalCSSForPage = async (url: string, options: Config): Promise<string> => {
  let cssString = ''
  const assetsPath = `${options.themeRoot}/assets`
  const cssFiles = fs.readdirSync(assetsPath)
    .filter((file) => file.endsWith('.css'));

  for (const file of cssFiles) {
    console.log(file)
    const filePath = path.join(assetsPath, file);
    cssString += fs.readFileSync(filePath, 'utf-8') + '\n';
  }

  try {
    const { critical } = await Crittr({
      urls: [url],
      cssString,
      device: {
        width: 1200,
        height: 1200
      },
      timeout: 10000,
      pageLoadTimeout: 10000,
    })

    return critical
  } catch (error) {
    console.error(`Error generating critical CSS for ${url}`, error)
    return '';
  }
}

const vitePluginShopifyCriticalCss = (options: Config = {}): Plugin => {
  const resolvedOptions = resolveConfig(options)

  return {
    name: 'vite-plugin-shopify-critical-css',
    enforce: 'post',
    async buildEnd() {
      if (!resolvedOptions.baseUrl) {
        return
      }

      let liquidContent = `{% comment %}
IMPORTANT: This snippet is automatically generated.
Do not attempt to modify this file directly, as any changes will be overwritten.
{% endcomment %}

{% assign page_template = template | default: page.template %}
`;

      for (const [index, page] of resolvedOptions.pages.entries()) {
        const criticalCSS = await generateCriticalCSSForPage(`${resolvedOptions.baseUrl}/${page.uri}`, resolvedOptions);
        const condition = `page_template == "${page.template}"`;
        console.log(criticalCSS)

        if (index === 0) {
          liquidContent += `{% if ${condition} %}\n  <style>${criticalCSS}</style>\n`;
        } else {
          liquidContent += `{% elsif ${condition} %}\n  <style>${criticalCSS}</style>\n`;
        }
      }

      liquidContent += `{% endif %}\n`;

      // Write the generated Liquid content to the specified file
      const snippetFile = `${resolvedOptions.themeRoot}/snippets/${resolvedOptions.snippetFile}`
      fs.writeFileSync(path.resolve(snippetFile), liquidContent, 'utf-8');
      console.log(`Critical CSS Liquid written to ${snippetFile}`);
    }
  }
}

export default vitePluginShopifyCriticalCss
