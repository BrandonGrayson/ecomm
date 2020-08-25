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
}   

// Set up an asynchronos test functiion to run repo and create a new users repository
const test = async () => {
    const repo = new usersRepository('users.json');

    const users =  await repo.getAll();
    console.log(users);
};

test();