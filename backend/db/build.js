import { hash } from 'bcrypt';
import conn from './connection.js';
import { Owner, Van, Renter, Rental } from './models.js';

async function buildDatabase() {
  try {
    await conn;

    // Clear existing data
    await Promise.all([
      Owner.deleteMany({}),
      Van.deleteMany({}),
      Renter.deleteMany({}),
      Rental.deleteMany({})
    ]);

    // Insert owners
    const hashedPassword = await hash('p123', 10);
    const owners = await Owner.create([
      { email: 'b@b.com', password: hashedPassword, first_name: 'Bob', last_name: 'Smith' },
      { email: 'j@t.com', password: 'p456', first_name: 'Josh', last_name: 'Turner' },
      { email: 'j@d.com', password: 'p789', first_name: 'Jane', last_name: 'Doe' }
    ]);

    // Insert vans
    const vans = await Van.create([
      { owner_id: owners[0]._id, name: 'Modest Explorer', price: 60, description: 'The Modest Explorer is a van designed to get you out of the house and into nature...', image_url: 'https://assets.scrimba.com/advanced-react/react-router/modest-explorer.png', type: 'simple' },
      { owner_id: owners[0]._id, name: 'Beach Bum', price: 80, description: 'Beach Bum is a van inspired by surfers and travelers...', image_url: 'https://assets.scrimba.com/advanced-react/react-router/beach-bum.png', type: 'rugged' },
      { owner_id: owners[0]._id, name: 'Green Wonder', price: 70, description: 'With this van, you can take your travel life to the next level...', image_url: 'https://assets.scrimba.com/advanced-react/react-router/green-wonder.png', type: 'rugged' },
      { owner_id: owners[1]._id, name: 'Reliable Red', price: 100, description: 'Reliable Red is a van that was made for travelling...', image_url: 'https://assets.scrimba.com/advanced-react/react-router/reliable-red.png', type: 'luxury' },
      { owner_id: owners[2]._id, name: 'Dreamfinder', price: 65, description: 'Dreamfinder is the perfect van to travel in and experience...', image_url: 'https://assets.scrimba.com/advanced-react/react-router/dreamfinder.png', type: 'simple' },
      { owner_id: owners[2]._id, name: 'The Cruiser', price: 120, description: 'The Cruiser is a van for those who love to travel in comfort and luxury...', image_url: 'https://assets.scrimba.com/advanced-react/react-router/the-cruiser.png', type: 'luxury' }
    ]);

    // Insert renters
    const renters = await Renter.create([
      { email: 'j@g.com', password: 'j123', first_name: 'Jonathan', last_name: 'Gates' },
      { email: 'a@b.com', password: 'password123', first_name: 'Alice', last_name: 'Johnson' },
      { email: 'c@d.com', password: 'securepass', first_name: 'Charlie', last_name: 'Smith' },
      { email: 'e@f.com', password: 'letmein', first_name: 'Eva', last_name: 'Williams' },
      { email: 'g@h.com', password: 'pass123', first_name: 'Gary', last_name: 'Davis' }
    ]);

    // Insert rentals
    await Rental.create([
      { van_id: vans[0]._id, email: 'j@g.com', total_cost: 240, placed_date: new Date('2023-06-30T18:00:00Z'), start_date: new Date('2023-07-01T10:00:00Z'), end_date: new Date('2023-07-05T15:00:00Z') },
      { van_id: vans[1]._id, email: 'a@b.com', total_cost: 480, placed_date: new Date('2023-07-01T20:00:00Z'), start_date: new Date('2023-07-02T12:00:00Z'), end_date: new Date('2023-07-08T14:00:00Z') },
      { van_id: vans[2]._id, email: 'c@d.com', total_cost: 280, placed_date: new Date('2023-07-04T16:00:00Z'), start_date: new Date('2023-08-03T11:00:00Z'), end_date: new Date('2023-08-07T16:00:00Z') },
      { van_id: vans[3]._id, email: 'e@f.com', total_cost: 400, placed_date: new Date('2023-07-20T14:00:00Z'), start_date: new Date('2023-08-05T09:00:00Z'), end_date: new Date('2023-08-10T13:00:00Z') },
      { van_id: vans[4]._id, email: 'g@h.com', total_cost: 325, placed_date: new Date('2023-08-10T11:00:00Z'), start_date: new Date('2023-09-07T14:00:00Z'), end_date: new Date('2023-09-12T18:00:00Z') },
      { van_id: vans[5]._id, email: 'j@g.com', total_cost: 720, placed_date: new Date('2023-08-30T09:00:00Z'), start_date: new Date('2023-09-09T10:00:00Z'), end_date: new Date('2023-09-15T12:00:00Z') },
      { van_id: vans[0]._id, email: 'a@b.com', total_cost: 240, placed_date: new Date('2023-11-01T08:00:00Z'), start_date: new Date('2023-11-10T08:00:00Z'), end_date: new Date('2023-11-14T14:00:00Z') },
      { van_id: vans[1]._id, email: 'c@d.com', total_cost: 400, placed_date: new Date('2023-11-08T13:00:00Z'), start_date: new Date('2023-11-12T13:00:00Z'), end_date: new Date('2023-11-17T16:00:00Z') },
      { van_id: vans[2]._id, email: 'e@f.com', total_cost: 350, placed_date: new Date('2023-11-10T11:00:00Z'), start_date: new Date('2023-11-15T11:00:00Z'), end_date: new Date('2023-11-20T15:00:00Z') },
      { van_id: vans[3]._id, email: 'g@h.com', total_cost: 400, placed_date: new Date('2023-11-15T09:00:00Z'), start_date: new Date('2023-11-18T09:00:00Z'), end_date: new Date('2023-11-22T14:00:00Z') }
    ]);

    console.log('Database built successfully');
  } catch (error) {
    console.error('Error building database:', error);
  } finally {
    await conn.close();
  }
}

buildDatabase();
  
