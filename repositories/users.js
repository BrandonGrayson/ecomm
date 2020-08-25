// Require fs
const fs = require('fs');

// create a user Repository
class usersRepository  {
    constructor(filename) {
        if(!filename) {
           throw new Error('Creating a repository requires a filename');
        }

        this.filename = filename;
        try {
            fs.accessSync(this.filename);
        } catch (err) {
            fs.writeFileSync(this.filename, '[]');
        }
    }

    async getAll() {
        // Open the file called this.filename
       return JSON.parse(
           await fs.promises.readFile(this.filename, { 
            encoding: 'utf-8'
        }));
    }

    // create function 
    async create(attrs) {
        // create a variable that will store the contents of the get all function
        const records = await this.getAll();
        records.push(attrs);
        // write the updated "records" array back to this.filename
        await fs.promises.writeFile(this.filename, JSON.stringify(records));
    }
}   

// Set up an asynchronos test functiion to run repo and create a new users repository
const test = async () => {
    const repo = new usersRepository('users.json');

   await repo.create({ email:'test@test.com', password: 'password'});

    const users =  await repo.getAll();
    console.log(users);
};

test();