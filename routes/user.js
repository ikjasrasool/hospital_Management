exports.login = (req, res) => {
    res.render('index');
}
exports.home=(req,res)=>{
  res.render('hospital1');
}
exports.signup = (req, res) => {
    res.render('signup');
}

exports.signupS = (req, res) => {
    const { first_name, last_name, mob_no, user_name, password } = req.body;
    const query = "INSERT INTO users (first_name, last_name, mob_no, user_name, password) VALUES ($1, $2, $3, $4, $5)";
    db.query(query, [first_name, last_name, mob_no, user_name, password], (err, result) => {
        if (err) {
            console.error("Error inserting data:", err);
            return res.status(500).json({ message: 'An error occurred. Please try again later.' });
        }

        res.redirect("/login");
    });
}

exports.loginTo = (req, res) => {
    var post  = req.body;
    var name = post.user_name;
    var pass = post.password;
    const query = "SELECT * FROM users WHERE user_name = $1 AND password = $2";

    db.query(query, [name, pass], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ message: 'An error occurred. Please try again later.' });
        }
        console.log(results.rowCount);
        if (results.rowCount === 1) {
            res.render('hospital2');
        } else {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
    });
}

exports.insertA = (req, res) => {
    res.render('crudhtml');
}

exports.logout = (req, res) => {
    res.redirect("/");
}

exports.insertdata = (req, res) => {
    const { name, age, condition, address, appointment, phone } = req.body;
    const query = "INSERT INTO patients (name, age, conditions, address, appointment, phone) VALUES ($1, $2, $3, $4, $5, $6)";
    db.query(query, [name, age, condition, address, appointment, phone], (err, result) => {
        if (err) {
            console.error("Error inserting data:", err);
            res.status(500).send("Failed to insert data");
            return;
        }
        res.redirect("/report");
    });
}
exports.delete = (req, res) => {
  const { id } = req.body;
  const query = "SELECT * FROM patients WHERE id = $1";
  db.query(query, [id], (err, results) => {
      if (err) {
          console.error("Error retrieving data:", err);
          res.status(500).send("Failed to retrieve data");
          return;
      }

      if (results.rowCount === 0) {
          res.status(404).send("Patient not found");
          return;
      }

      const patient = results.rows[0];
      res.render('recipt', { patient });
  });
}


exports.exit=(req,res)=>
{
  res.render('hospital2');
}

exports.report=((req, res) => {
  const query = "SELECT * FROM patients";
  db.query(query, (err, results) => {
      if (err) {
          console.error("Error fetching data:", err);
          res.status(500).send("Failed to fetch data");
          return;
      }

      res.render('appoin', { results: results.rows });
  });
});




exports.renderIndex = (req, res) => {
    res.render('ind');
};

exports.insertDoctor = async (req, res, pool) => {
    const { name, specialization, contact, details } = req.body;
    const photo = req.file ? req.file.filename : null;
    try {
        await pool.query(
            "INSERT INTO doctors (name, photo, specialization, contact, details) VALUES ($1, $2, $3, $4, $5)",
            [name, photo, specialization, contact, details]
        );
        res.redirect('/re');
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).send('Failed to insert data');
    }
};

exports.getDoctors = async (req, res, pool) => {
    try {
        const result = await pool.query('SELECT * FROM doctors');
        res.render('report', { doctors: result.rows });
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Failed to fetch data');
    }
};

exports.renderDelete = async (req, res, pool) => {
    try {
        const result = await pool.query('SELECT * FROM doctors');
        res.render('delete', { doctors: result.rows });
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Failed to fetch data');
    }
};

exports.deleteDoctor = async (req, res, pool) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM doctors WHERE id = $1', [id]);
        res.redirect('/del');
    } catch (err) {
        console.error('Error deleting data:', err);
        res.status(500).send('Failed to delete data');
    }
};

exports.renderUpdate = async (req, res, pool) => {
    try {
        const result = await pool.query('SELECT * FROM doctors');
        res.render('update', { doctors: result.rows });
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Failed to fetch data');
    }
};

exports.updateDoctor = async (req, res, pool) => {
    const { id } = req.params;
    const { name, specialization, contact, details } = req.body;
    const photo = req.file ? req.file.filename : null;

    try {
        const updateFields = [];
        const values = [id];
        let query = 'UPDATE doctors SET ';

        if (name) {
            values.push(name);
            updateFields.push(`name = $${values.length}`);
        }
        if (photo) {
            values.push(photo);
            updateFields.push(`photo = $${values.length}`);
        }
        if (specialization) {
            values.push(specialization);
            updateFields.push(`specialization = $${values.length}`);
        }
        if (contact) {
            values.push(contact);
            updateFields.push(`contact = $${values.length}`);
        }
        if (details) {
            values.push(details);
            updateFields.push(`details = $${values.length}`);
        }

        query += updateFields.join(', ') + ` WHERE id = $1`;
        await pool.query(query, values);
        res.redirect('/up');
    } catch (err) {
        console.error('Error updating data:', err);
        res.status(500).send('Failed to update data');
    }
};

