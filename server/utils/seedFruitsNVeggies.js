import pool from "./db.js";

async function seedDB() {
  await pool.query(
    `INSERT INTO fruits (name, image_url, health_benefits) VALUES 
    ('Banana', '/images/fruitsPic/bananas.png', 'Rich in fiber and prebiotics that feed your gut bacteria. Which is good because it helps keep your digestion smooth and supports a healthy balance in your gut.'),
    ('Kiwi', '/images/fruitsPic/kiwis.png', 'High in vitamin C and contains enzymes that aid digestion. Which is good because it helps your gut break down food more easily and supports immune health.'),
    ('Watermelon', '/images/fruitsPic/watermelon.png', 'Hydrating fruit rich in antioxidants that support gut lining. Which is good because a strong gut lining helps protect against inflammation and keeps harmful substances out.'),
    ('Apple (Red)', '/images/fruitsPic/red-apples.png', 'High in pectin, a type of fiber that feeds gut bacteria. Which is good because it helps increase the number of good bacteria that support digestion and reduce inflammation.'),
    ('Apple (Green)', '/images/fruitsPic/green-apples.png', 'Contain polyphenols and fiber that support metabolism and gut health. Which is good because it helps your body process nutrients better and strengthens your gut microbiome.'),
    ('Grapes', '/images/fruitsPic/grapes.png', 'Contain resveratrol and polyphenols that support microbiota diversity. Which is good because a diverse microbiome is linked to better overall health and disease resistance.')
    ON CONFLICT DO NOTHING;`
  );

  await pool.query(
    `INSERT INTO vegetables (name, image_url, health_benefits) VALUES 
    ('Pepper', '/images/veggiesPic/peppers.png', 'Rich in vitamin C and antioxidants that support immune function in the gut. Which is good because it helps your gut fight off harmful bacteria and stay balanced.'),
    ('Broccoli', '/images/veggiesPic/broccolis.png', 'Contains sulforaphane, which helps beneficial gut bacteria thrive. Which is good because it supports detox processes and reduces inflammation.'),
    ('Cauliflower', '/images/veggiesPic/cauliflower.png', 'High in fiber and supports digestion by feeding good gut microbes. Which is good because it helps your gut stay regular and reduces bloating.'),
    ('Pointed Cabbage', '/images/veggiesPic/pointed-cabbage.png', 'Rich in fermentable fiber that supports gut-friendly bacteria. Which is good because it promotes a balanced microbiome and may improve bowel movements.'),
    ('Portobello Mushrooms', '/images/veggiesPic/portobello.png', 'Contain beta-glucans that modulate the gut microbiome and support immunity. Which is good because it helps your gut fight infections and stay strong.'),
    ('Corn', '/images/veggiesPic/corn.png', 'Contains resistant starch, a type of fiber that feeds beneficial gut bacteria. Which is good because it helps increase short-chain fatty acids that support gut lining and reduce inflammation.')
    ON CONFLICT DO NOTHING;`
  );

  console.log("DB filled up!");
  await pool.end();
}

seedDB();
