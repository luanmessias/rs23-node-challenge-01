import fs from 'fs';
import { parse } from 'csv-parse';

const filePath = new URL('./tasks.csv', import.meta.url);


fs.createReadStream(filePath)
  .pipe(parse({ 
    skip_empty_lines: true,
    from_line: 2,
    delimiter: ';',
  }))
  .on('data', async (row) => {
    const [title, description] = row;

    await fetch('http://localhost:3344/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, description })
    });
  })
  .on('end', () => {
    console.log('Task import finished.');
  });

