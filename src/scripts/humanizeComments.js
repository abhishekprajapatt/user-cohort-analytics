import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// sabhi emojis ko hata dete hain aur comments ko Hindi me convert karte hain
class CommentHumanizer {
  static emojiRegex =
    /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;

  static processFile(filePath) {
    try {
      if (!fs.existsSync(filePath)) {
        console.log(`File nahi mila: ${filePath}`);
        return;
      }

      let content = fs.readFileSync(filePath, 'utf8');
      let changed = false;

      // emojis remove karte hain
      const originalContent = content;
      content = content.replace(this.emojiRegex, '');

      if (content !== originalContent) {
        changed = true;
        console.log(`Emojis removed from: ${path.basename(filePath)}`);
      }

      // English comments ko Hindi me convert karte hain
      content = this.convertCommentsToHindi(content, filePath);

      if (changed || content !== fs.readFileSync(filePath, 'utf8')) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated: ${path.basename(filePath)}`);
      }
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error.message);
    }
  }

  static convertCommentsToHindi(content, filePath) {
    const ext = path.extname(filePath);

    if (ext === '.js') {
      return this.convertJSComments(content);
    } else if (ext === '.md') {
      return this.convertMarkdownContent(content);
    }

    return content;
  }

  static convertJSComments(content) {
    // single line comments
    content = content.replace(/\/\/ Import /g, '// import karte hain ');
    content = content.replace(/\/\/ Export /g, '// export karte hain ');
    content = content.replace(/\/\/ Create /g, '// banate hain ');
    content = content.replace(/\/\/ Get /g, '// get karte hain ');
    content = content.replace(/\/\/ Set /g, '// set karte hain ');
    content = content.replace(/\/\/ Update /g, '// update karte hain ');
    content = content.replace(/\/\/ Delete /g, '// delete karte hain ');
    content = content.replace(/\/\/ Check /g, '// check karte hain ');
    content = content.replace(/\/\/ Validate /g, '// validate karte hain ');
    content = content.replace(/\/\/ Calculate /g, '// calculate karte hain ');
    content = content.replace(/\/\/ Generate /g, '// generate karte haiN ');
    content = content.replace(/\/\/ Process /g, '// process karte hain ');
    content = content.replace(/\/\/ Handle /g, '// handle karte hain ');
    content = content.replace(/\/\/ Build /g, '// build karte hain ');
    content = content.replace(/\/\/ Load /g, '// load karte hain ');
    content = content.replace(/\/\/ Save /g, '// save karte hain ');
    content = content.replace(/\/\/ Find /g, '// find karte hain ');
    content = content.replace(/\/\/ Search /g, '// search karte hain ');
    content = content.replace(/\/\/ Filter /g, '// filter karte hain ');
    content = content.replace(/\/\/ Sort /g, '// sort karte hain ');
    content = content.replace(/\/\/ Map /g, '// map karte hain ');
    content = content.replace(/\/\/ Reduce /g, '// reduce karte hain ');
    content = content.replace(/\/\/ Connect /g, '// connect karte hain ');
    content = content.replace(/\/\/ Setup /g, '// setup karte hain ');
    content = content.replace(/\/\/ Initialize /g, '// initialize karte hain ');
    content = content.replace(/\/\/ Configure /g, '// configure karte hain ');
    content = content.replace(/\/\/ Start /g, '// start karte hain ');
    content = content.replace(/\/\/ Stop /g, '// stop karte hain ');
    content = content.replace(/\/\/ Close /g, '// close karte hain ');
    content = content.replace(/\/\/ Open /g, '// open karte hain ');
    content = content.replace(/\/\/ Read /g, '// read karte hain ');
    content = content.replace(/\/\/ Write /g, '// write karte hain ');
    content = content.replace(/\/\/ Parse /g, '// parse karte hain ');
    content = content.replace(/\/\/ Format /g, '// format karte hain ');
    content = content.replace(/\/\/ Transform /g, '// transform karte hain ');
    content = content.replace(/\/\/ Convert /g, '// convert karte hain ');
    content = content.replace(/\/\/ Merge /g, '// merge karte hain ');
    content = content.replace(/\/\/ Split /g, '// split karte hain ');
    content = content.replace(/\/\/ Join /g, '// join karte hain ');
    content = content.replace(/\/\/ Clone /g, '// clone karte hain ');
    content = content.replace(/\/\/ Copy /g, '// copy karte hain ');
    content = content.replace(/\/\/ Move /g, '// move karte hain ');
    content = content.replace(/\/\/ Remove /g, '// remove karte hain ');
    content = content.replace(/\/\/ Clear /g, '// clear karte hain ');
    content = content.replace(/\/\/ Reset /g, '// reset karte hain ');
    content = content.replace(/\/\/ Refresh /g, '// refresh karte hain ');
    content = content.replace(/\/\/ Reload /g, '// reload karte hain ');
    content = content.replace(/\/\/ Restart /g, '// restart karte hain ');
    content = content.replace(/\/\/ Execute /g, '// execute karte hain ');
    content = content.replace(/\/\/ Run /g, '// run karte hain ');
    content = content.replace(/\/\/ Call /g, '// call karte hain ');
    content = content.replace(/\/\/ Invoke /g, '// invoke karte hain ');
    content = content.replace(/\/\/ Trigger /g, '// trigger karte hain ');
    content = content.replace(/\/\/ Fire /g, '// fire karte hain ');
    content = content.replace(/\/\/ Emit /g, '// emit karte hain ');
    content = content.replace(/\/\/ Send /g, '// send karte hain ');
    content = content.replace(/\/\/ Receive /g, '// receive karte hain ');
    content = content.replace(/\/\/ Listen /g, '// listen karte hain ');
    content = content.replace(/\/\/ Watch /g, '// watch karte hain ');
    content = content.replace(/\/\/ Monitor /g, '// monitor karte hain ');
    content = content.replace(/\/\/ Track /g, '// track karte hain ');
    content = content.replace(/\/\/ Log /g, '// log karte hain ');
    content = content.replace(/\/\/ Debug /g, '// debug karte hain ');
    content = content.replace(/\/\/ Test /g, '// test karte hain ');
    content = content.replace(/\/\/ Mock /g, '// mock karte hain ');
    content = content.replace(/\/\/ Stub /g, '// stub karte hain ');
    content = content.replace(/\/\/ Spy /g, '// spy karte hain ');
    content = content.replace(/\/\/ Assert /g, '// assert karte hain ');
    content = content.replace(/\/\/ Expect /g, '// expect karte hain ');

    // block comments patterns
    content = content.replace(
      /\/\*\*\s*\n\s*\* ([^*]+)\s*\n\s*\*\//g,
      (match, desc) => {
        const hindiDesc = this.translateToHindi(desc.trim());
        return `// ${hindiDesc}`;
      }
    );

    content = content.replace(/\/\*\s*([^*]+)\s*\*\//g, (match, desc) => {
      const hindiDesc = this.translateToHindi(desc.trim());
      return `// ${hindiDesc}`;
    });

    return content;
  }

  static convertMarkdownContent(content) {
    // markdown headers me emojis remove karte hain
    content = content.replace(/^(#+)\s*[^\w\s]*\s*(.+)$/gm, '$1 $2');

    // list items me emojis remove karte hain
    content = content.replace(/^(\s*[-*+])\s*[^\w\s]*\s*(.+)$/gm, '$1 $2');

    return content;
  }

  static translateToHindi(text) {
    const translations = {
      'Get all': 'sabhi ko get karne ke liye',
      'Create new': 'naya banane ke liye',
      'Update existing': 'existing ko update karne ke liye',
      Delete: 'delete karne ke liye',
      Find: 'find karne ke liye',
      Search: 'search karne ke liye',
      Filter: 'filter karne ke liye',
      Sort: 'sort karne ke liye',
      Calculate: 'calculate karne ke liye',
      Generate: 'generate karne ke liye',
      Process: 'process karne ke liye',
      Handle: 'handle karne ke liye',
      Validate: 'validate karne ke liye',
      Check: 'check karne ke liye',
      Build: 'build karne ke liye',
      Setup: 'setup karne ke liye',
      Initialize: 'initialize karne ke liye',
      Configure: 'configure karne ke liye',
      Connect: 'connect karne ke liye',
      Load: 'load karne ke liye',
      Save: 'save karne ke liye',
      Import: 'import karne ke liye',
      Export: 'export karne ke liye',
      User: 'user',
      Order: 'order',
      Cohort: 'cohort',
      Database: 'database',
      Schema: 'schema',
      Model: 'model',
      Controller: 'controller',
      Service: 'service',
      Route: 'route',
      Middleware: 'middleware',
      Configuration: 'configuration',
      Environment: 'environment',
      Variables: 'variables',
      Constants: 'constants',
      Utilities: 'utilities',
      Helper: 'helper',
      Function: 'function',
      Method: 'method',
      Class: 'class',
      Object: 'object',
      Array: 'array',
      String: 'string',
      Number: 'number',
      Boolean: 'boolean',
      Response: 'response',
      Request: 'request',
      Error: 'error',
      Success: 'success',
      Failed: 'failed',
      Completed: 'completed',
    };

    let result = text;
    for (const [english, hindi] of Object.entries(translations)) {
      result = result.replace(new RegExp(english, 'gi'), hindi);
    }

    return result;
  }

  static async processAllFiles() {
    console.log('Code comments ko humanize kar rahe hain...\n');

    const projectRoot = path.resolve(__dirname, '..');

    // process karne ke liye files
    const filesToProcess = [
      // main files
      'app.js',

      // config files
      'config/database.js',

      // models
      'models/User.js',
      'models/Order.js',

      // controllers
      'controllers/userController.js',
      'controllers/orderController.js',
      'controllers/cohortController.js',
      'controllers/advancedCohortController.js',

      // services
      'services/cohortService.js',
      'services/advancedCohortService.js',

      // routes
      'routes/users.js',
      'routes/orders.js',
      'routes/cohorts.js',
      'routes/advancedCohortRoutes.js',

      // utils
      'utils/constants.js',
      'utils/logger.js',
      'utils/advancedCohortRules.js',

      // scripts
      'scripts/seedData.js',
      'scripts/generateCohorts.js',
      'scripts/processExcelFile.js',
      'scripts/analyzeExcel.js',
      'scripts/testAdvancedCohorts.js',
      'scripts/validateSetup.js',
    ];

    let processedCount = 0;

    for (const file of filesToProcess) {
      const fullPath = path.join(projectRoot, file);
      this.processFile(fullPath);
      processedCount++;
    }

    // root level markdown files
    const rootFiles = [
      '../README.md',
      '../INSTALLATION_GUIDE.md',
      '../API_DOCUMENTATION_ADVANCED_COHORTS.md',
      '../EXCEL_ANALYSIS_REPORT.md',
    ];

    for (const file of rootFiles) {
      const fullPath = path.join(__dirname, file);
      this.processFile(fullPath);
      processedCount++;
    }

    console.log(`\nProcessing complete! ${processedCount} files processed.`);
    console.log(
      'Sabhi emojis remove ho gaye aur comments Hindi me convert ho gaye.'
    );
  }
}

// script ko directly run karne pe
if (import.meta.url === `file://${process.argv[1]}`) {
  CommentHumanizer.processAllFiles()
    .then(() => {
      console.log('\nComment humanization completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error during comment humanization:', error);
      process.exit(1);
    });
}

export default CommentHumanizer;
