var connection = require('../db/db-connection');

exports.getAllCountries = (req, res) => {

    const query = "select display_name from countries;";
    connection.query(query, (err, rows) => {

        if (err) throw err;

        // Introduce delay. For testing purposes
        // setTimeout(function() {
        //     res.status(200).json({
        //         status: 'success',
        //         results: rows.length,
        //         data: {
        //             countries: JSON.parse(JSON.stringify(rows))
        //         }
        //     });
        //     console.log('This printed after about 5 second');
        //   }, 5000);

        res.status(200).json({
            status: 'success',
            results: rows.length,
            data: {
                countries: JSON.parse(JSON.stringify(rows))
            }
        });
    });
};