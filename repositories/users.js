// Require fs
const fs = require('fs');
const crypto = require('crypto');

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
        attrs.id = this.randomId();
        // create a variable that will store the contents of the get all function
        const records = await this.getAll();
        records.push(attrs);
        // write the updated "records" array back to this.filename
        await this.writeAll(records);        
    }

    async writeAll(records) {
        await fs.promises.writeFile(this.filename, JSON.stringify(records));
    }

        // generate random set of data
    randomId() {
        return crypto.randomBytes(4).toString('hex');
    }

    async getOne(id) {
        const records = await this.getAll();
        return records.find(record => record.id === id);
    }

    async delete(id) {
        const records = await this.getAll();
        const filteredRecords = records.filter(record => record.id !== id);
        await this.writeAll(filteredRecords);
    }

    async update(id, attrs) {
        const records = await this.getAll();
        const record = records.find(record => record.id === id);

        if (!record) {
            throw new Error(`Record with id ${id} not found`);
        }

        Object.assign(record, attrs);
        await this.writeAll(records);
    }

    async getOneBy(filters) {
        const records = await this.getAll();

        for (let record of records) {
            let found = true;

            for (let key in filters) {
                if (record[key] !== filters[key]) {
                    found = false;
                }
            }

            if (found) {
                return record;
            }
        }
    }
}   

// Set up an asynchronos test functiion to run repo and create a new users repository
const test = async () => {
    const repo = new usersRepository('users.json');

    const user = await repo.getOneBy({
        id: '2fa5234342ab88'
    });

    console.log(user);
};

test();