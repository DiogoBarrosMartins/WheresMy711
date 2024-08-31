const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const url = 'https://www.google.com/maps/place/R+Joaquim+Ant%C3%B3nio+Aguiar/@38.724433,-9.1546545,18z/data=!4m18!1m9!3m8!1s0xd193371caa9f1d5:0x9d3a6d1c0c39855c!2sR+Joaquim+Ant%C3%B3nio+Aguiar!6m1!1v5!8m2!3d38.7251214!4d-9.1552676!16s%2Fg%2F11dfj5t_q3!3m7!1s0xd193371caa9f1d5:0x9d3a6d1c0c39855c!6m1!1v5!8m2!3d38.7251214!4d-9.1552676!16s%2Fg%2F11dfj5t_q3?entry=ttu&g_ep=EgoyMDI0MDgyNy4wIKXMDSoASAFQAw%3D%3D';

const fetchBusInfo = async () => {
    console.time('Total Execution Time');
  try {
    const browser = await puppeteer.launch({ headless: true, defaultViewport: null });
    const page = await browser.newPage();

    // Block unnecessary resources to speed up loading
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if (['image', 'stylesheet', 'font'].includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });

    // Handle consent dialog if it appears
    try {
      await page.waitForSelector('button', { timeout: 2000 });
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        buttons.forEach((btn) => {
          if (btn.textContent.includes('Rejeitar tudo') || btn.textContent.includes('Reject all')) {
            btn.click();
          }
        });
      });
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for actions to complete
    } catch (error) {
      console.log('No consent dialog or already handled.');
    }

    // Wait for a specific element that indicates bus information is loaded
    try {
      await page.waitForSelector('div[jsaction]', { timeout: 2000 });
    } catch (error) {
      console.error('Timeout waiting for bus information to load.');
    }

    // Scroll to the bottom of the page to ensure all content is loaded
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise(resolve => setTimeout(resolve, 1000)); // Manual timeout

    // Directly get the HTML content from Puppeteer
    const htmlContent = await page.content();
    await browser.close();

    // Load HTML content with Cheerio
    const $ = cheerio.load(htmlContent);

    // Extract and format bus destinations and times for "Alto Damaia"
    const extractedInfoMap = new Map();

    // Select only the div elements that likely contain the required bus information
    $('div').each((i, div) => {
      const destinationText = $(div).text().trim();

      // Use regex to match patterns like "711Alto Damaia06:11"
      const regex = /(711Alto Damaia)(\d{2}:\d{2})/g;
      let match;
      while ((match = regex.exec(destinationText)) !== null) {
        const destination = match[1].trim(); // "711Alto Damaia"
        const time = match[2]; // Time in "HH:MM" format
        
        // Create a unique key combining destination and time
        const key = `${destination}-${time}`;
        
        if (!extractedInfoMap.has(key)) {
          extractedInfoMap.set(key, { destination, time });
        }
      }
    });

    // Convert Map to Array and format the output
    if (extractedInfoMap.size > 0) {
      console.log('-----------------------------------');
      console.log('|  Destination       |  Time      |');
      console.log('-----------------------------------');
      
      extractedInfoMap.forEach(info => {
        const { destination, time } = info;
        console.log(`|  ${destination.padEnd(17)}|  ${time.padEnd(9)}|`);
      });

      console.log('-----------------------------------\n');
    } else {
      console.log('No matching bus information found.');
    }

  } catch (error) {
    console.error('Error during Puppeteer execution:', error.message);
  }
  console.timeEnd('Total Execution Time');
};

fetchBusInfo();
