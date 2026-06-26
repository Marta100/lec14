
// 1)შექმენი utils/helepr.js. შექმენი ფუნქცია რომელსაც მიიღებს სტრინგს და გადააქცევს 
// capital letter-ად. აუცილებელია გამოიყენო module(package-დან შეცვალე)

//const capitalizeString = require('./utils/helper.js');
//const input = 'hello world';
//const output = capitalizeString(input);
//console.log('Input string:', input);
//console.log('Capitalized:', output);

// 2) დაწერე ფუქნცია რომელიც შეამოწმებს გადმოცემული სტრინგი პალინდრომია თუ არა 
// (ანუ ორივე მხრიდან თუ ერთნაირად იკითხება). აუცილებელია module(package-დან შეცვალე) 
// გამოიყენო.

//const isPalindrome = require('./utils/palindrome.js');
//const palindromeInput = 'level';
//const palindromeResult = isPalindrome(palindromeInput);
//console.log(`Is "${palindromeInput}" a palindrome?`, palindromeResult);

//3)დაწერე ფუქნცია რომელიც იპოვის ყველაზე გრძელ სიტყვას როცა გადავცემ 
// (I love JavaScript very much) - უნდა დააბრუნოს JavaScript. აუცილებელია გამოიყენო
//  module.

//const longestword = require('./utils/longestword.js');
//const longestWordInput = 'I love JavaScript very much';
//const longestWordResult = longestword(longestWordInput);
//console.log(`The longest word in "${longestWordInput}" is:`, longestWordResult);

//4)შექმენი სერვერი სადაც გექნება როუტები,"/","/users","/posts".
//აუცილებელია გაუკეთო ორივეს pagination,id-ის მეშვეობით ძებნა და /users ასევე 
// დაამატე name-ით ძებნა

//const http = require('http');
//const fs = require('fs');
//const path = require('path');
//const PORT = 3000;

//const usersPath = path.join(__dirname, 'users.json');
//const postsPath = path.join(__dirname, 'posts.json');
//const usersFileData = fs.readFileSync(usersPath, 'utf8');
//const postsFileData = fs.readFileSync(postsPath, 'utf8');
//const { users } = JSON.parse(usersFileData);
//const posts = JSON.parse(postsFileData);

//function sendJson(res, statusCode, data) {
  //  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  //  res.end(JSON.stringify(data));
//}

//function paginate(items, page, limit) {
    //const safePage = Math.max(1, Number(page) || 1);
   // const safeLimit = Math.max(1, Number(limit) || 10);
   // const startIndex = (safePage - 1) * safeLimit;
   // const endIndex = startIndex + safeLimit;

   // return {
    //    page: safePage,
    //    limit: safeLimit,
    //    total: items.length,
    //    data: items.slice(startIndex, endIndex)
   // };
//}

//const server = http.createServer((req, res) => {
    //if (req.method !== 'GET') {
    //    sendJson(res, 405, { error: 'Method not allowed' });
    //    return;
    //}

   // const url = new URL(req.url, `http://${req.headers.host}`);
    //const { pathname, searchParams } = url;

    //if (pathname === '/') {
     //   sendJson(res, 200, {
    //        message: 'Server is running',
    //        routes: ['/', '/users', '/posts']
    //    });
     //   return;
    //}

    //if (pathname === '/users') {
     //   const id = searchParams.get('id');
    //    const name = searchParams.get('name');
     //   const page = searchParams.get('page');
     //   const limit = searchParams.get('limit');

    //    if (id) {
      //      const user = users.find((item) => item.id === Number(id));
      //      if (!user) {
      //          sendJson(res, 404, { error: 'User not found' });
      //          return;
      //      }
      //      sendJson(res, 200, user);
      //      return;
      //  }

      //  if (name) {
      //      const filteredUsers = users.filter((user) =>
      //          user.name.toLowerCase().includes(name.toLowerCase())
      //      );
      //      sendJson(res, 200, paginate(filteredUsers, page, limit));
      //      return;
      //  }

       // sendJson(res, 200, paginate(users, page, limit));
      //  return;
    //}

    //if (pathname === '/posts') {
     //   const id = searchParams.get('id');
     //   const page = searchParams.get('page');
     //   const limit = searchParams.get('limit');

      //  if (id) {
      //      const post = posts.find((item) => item.id === Number(id));
       //     if (!post) {
       //         sendJson(res, 404, { error: 'Post not found' });
       //         return;
       //     }
       //     sendJson(res, 200, post);
       //     return;
       // }

       // sendJson(res, 200, paginate(posts, page, limit));
       // return;
    //}

    //sendJson(res, 404, { error: 'Route not found' });
//});

//server.listen(PORT, () => {
  //  //console.log(`Server is running on http://localhost:${PORT}`);
//});

//5) შექმენი products-cli,რომელსაც ექნება დამატება,წაკითხვა,id-ის მიხედვით წაკითხვა,
//  წაშლა და აფდეითი.fields(name,description,date,category) + მე თუ გავატან option ის
//  მიხედვით --isexpire. უნდა შეამოწმოს თარიღი და დაამატოს ვადა აქვს გასული თუ არა

const fs = require('fs/promises');
const path = require('path');
const { Command } = require('commander');

const productsFilePath = path.join(__dirname, 'products.json');

async function loadProducts() {
    try {
        const data = await fs.readFile(productsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            await fs.writeFile(productsFilePath, JSON.stringify([], null, 2));
            return [];
        }
        throw error;
    }
}

async function saveProducts(products) {
    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
}

function getExpiryStatus(dateString) {
    const targetDate = new Date(dateString);

    if (Number.isNaN(targetDate.getTime())) {
        return { isExpired: false, status: 'invalid-date' };
    }

    const today = new Date();
    const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const normalizedTarget = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

    return {
        isExpired: normalizedTarget < normalizedToday,
        status: normalizedTarget < normalizedToday ? 'expired' : 'active'
    };
}

function formatProduct(product, includeExpiry) {
    if (!includeExpiry) {
        return product;
    }

    return {
        ...product,
        ...getExpiryStatus(product.date)
    };
}

function createProgram() {
    const program = new Command();

    program
        .name('davaleba14')
        .description('Products CLI')
        .version('1.0.0');

    program
        .command('list')
        .alias('show')
        .description('List all products')
        .option('--isexpire', 'Add expiration status')
        .action(async (options) => {
            const products = await loadProducts();
            console.log(JSON.stringify(products.map((product) => formatProduct(product, options.isexpire)), null, 2));
        });

    program
        .command('add')
        .description('Add a new product')
        .requiredOption('--name <name>', 'Product name')
        .requiredOption('--description <description>', 'Product description')
        .requiredOption('--date <date>', 'Product date')
        .requiredOption('--category <category>', 'Product category')
        .option('--isexpire', 'Add expiration status')
        .action(async (options) => {
            const products = await loadProducts();
            const newProduct = {
                id: products.length ? products[products.length - 1].id + 1 : 1,
                name: options.name,
                description: options.description,
                date: options.date,
                category: options.category
            };

            products.push(newProduct);
            await saveProducts(products);
            console.log('Product added successfully');
            console.log(JSON.stringify(formatProduct(newProduct, options.isexpire), null, 2));
        });

    program
        .command('get')
        .description('Get a product by id')
        .requiredOption('--id <id>', 'Product id')
        .option('--isexpire', 'Add expiration status')
        .action(async (options) => {
            const products = await loadProducts();
            const id = Number(options.id);
            const product = products.find((item) => item.id === id);

            if (!product) {
                console.log('Product not found');
                return;
            }

            console.log(JSON.stringify(formatProduct(product, options.isexpire), null, 2));
        });

    program
        .command('delete')
        .description('Delete a product by id')
        .requiredOption('--id <id>', 'Product id')
        .action(async (options) => {
            const products = await loadProducts();
            const id = Number(options.id);
            const index = products.findIndex((item) => item.id === id);

            if (index === -1) {
                console.log('Product not found');
                return;
            }

            products.splice(index, 1);
            await saveProducts(products);
            console.log('Product deleted successfully');
        });

    program
        .command('update')
        .description('Update a product by id')
        .requiredOption('--id <id>', 'Product id')
        .option('--name <name>', 'New product name')
        .option('--description <description>', 'New product description')
        .option('--date <date>', 'New product date')
        .option('--category <category>', 'New product category')
        .option('--isexpire', 'Add expiration status')
        .action(async (options) => {
            const products = await loadProducts();
            const id = Number(options.id);
            const product = products.find((item) => item.id === id);

            if (!product) {
                console.log('Product not found');
                return;
            }

            if (options.name) product.name = options.name;
            if (options.description) product.description = options.description;
            if (options.date) product.date = options.date;
            if (options.category) product.category = options.category;

            await saveProducts(products);
            console.log('Product updated successfully');
            console.log(JSON.stringify(formatProduct(product, options.isexpire), null, 2));
        });

    return program;
}

createProgram().parseAsync(process.argv);


