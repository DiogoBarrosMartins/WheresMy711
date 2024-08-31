
# WheresMy711

A simple Node.js script to track the next bus timings for my route from work to home directly from the terminal!

## Overview

This project uses Puppeteer and Cheerio to scrape bus information from Google Maps. It provides real-time updates on the arrival times of the "711 Alto Damaia" bus, which I take from work to home. The goal is to make it easy to check the bus timings without having to open a browser, directly from the command line.

## Features

- Scrapes real-time bus information from Google Maps.
- Displays the bus timings for the "711 Alto Damaia" route in a clean, formatted table.
- Optimized to run quickly by blocking unnecessary resources and reducing timeouts.

## Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/DiogoBarrosMartins/WheresMy711.git
   cd WheresMy711
   ```

2. Install the required dependencies:

   ```bash
   npm install puppeteer cheerio
   ```

## Usage

Run the script to get the latest bus timings:

```bash
node bus.js
```

## How It Works

1. The script uses Puppeteer to launch a headless browser and navigate to the Google Maps URL containing the bus stop information.
2. It waits for the necessary elements to load and extracts the bus timings using Cheerio, a jQuery-like library for traversing and manipulating the DOM.
3. The extracted information is then formatted and displayed in the terminal in a clean table format.

## Performance Optimization

- Blocks loading of images, stylesheets, and fonts to reduce page load time.
- Eliminates unnecessary timeouts to speed up execution.
- Only extracts relevant information to display in the terminal.

## Author

This script was created by [Diogo Barros Martins](https://github.com/DiogoBarrosMartins) for personal use to check bus timings quickly and easily!

## License

This project is open-source and available under the MIT License.

## Contributing

If you have any suggestions or improvements, feel free to fork the repository and submit a pull request.

---

Happy bus tracking!
