import puppeteer from 'puppeteer';

const websites = [
  { url: 'https://animated-sunburst-61a20d.netlify.app/', file: 'public/projects/project1.png' },
  { url: 'https://luxury-stroopwafel-0ea598.netlify.app/', file: 'public/projects/project2.png' },
  { url: 'https://livewebfortfc.netlify.app/', file: 'public/projects/project3.png' },
  { url: 'https://meek-cendol-37479c.netlify.app/', file: 'public/projects/project4.png' }
];

async function capture() {
  const browser = await puppeteer.launch({ headless: 'new' });
  for (const site of websites) {
    console.log(`Capturing ${site.url}...`);
    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 800 });
      await page.goto(site.url, { waitUntil: 'networkidle2', timeout: 30000 });
      
      // Wait an extra second for animations to finish
      await new Promise(r => setTimeout(r, 1000));
      
      await page.screenshot({ path: site.file });
      await page.close();
      console.log(`Saved ${site.file}`);
    } catch (e) {
      console.error(`Error capturing ${site.url}:`, e);
    }
  }
  await browser.close();
  console.log('Done.');
}

capture();
