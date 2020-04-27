'use strict'

// Asenna ensin mysql driver 
// npm install mysql --save

var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',  // HUOM! Älä käytä root:n tunnusta tuotantokoneella!!!!
  password : '',
  database : 'asiakas'
});

module.exports = 
{
    poista: function(req, res){      
      
      connection.query("DELETE FROM asiakas WHERE avain = '" + req.params.id + "'", function(error, results){
        if ( error ){
          console.log("Virhe haettaessa dataa Asiakas-taulusta, syy: " + error);
          //res.send(error);
          //res.send(JSON.stringify({"status": 500, "error": error, "response": null})); 
          res.send({"status": 500, "error": error, "response": null}); 
        }
        else
        {
          //console.log("Data = " + JSON.stringify(results));
          res.json(results);
        }
        //res.send("Poistettu " + results.affectedRows + " rivi");
      });
      
    },

    fetch: function( req, res ) {
      
        connection.query("SELECT * FROM asiakas WHERE avain = '" + req.params.id + "'", function(error, results){
          if ( error ){
            console.log("Virhe haettaessa dataa Asiakas-taulusta, syy: " + error);
            //res.send(error);
            //res.send(JSON.stringify({"status": 500, "error": error, "response": null})); 
            res.send({"status": 500, "error": error, "response": null}); 
          }
          else
          {
            //console.log("Data = " + JSON.stringify(results));
            res.json(results);
          }
      })
    },

    fetchTypes: function (req, res) {  
      connection.query('SELECT Avain, Lyhenne, Selite FROM Asiakastyyppi', function(error, results){
        if ( error ){
          console.log("Virhe haettaessa dataa Asiakas-taulusta, syy: " + error);
          //res.send(error);
          //res.send(JSON.stringify({"status": 500, "error": error, "response": null})); 
          res.send({"status": 500, "error": error, "response": null}); 
        }
        else
        {
          //console.log("Data = " + JSON.stringify(results));
          res.json(results);
        }
    });

    },

    fetchTyyppi: function(req, res){
      var sql = 'SELECT * FROM asiakastyyppi';
      if(Object.keys(req.query).length !== 0){
        var avain = req.query.AVAIN;
        var lyhenne = req.query.LYHENNE;
        var selite = req.query.SELITE;

        sql += ' WHERE AVAIN LIKE "' + avain;
        sql += ' AND LYHENNE LIKE "' + lyhenne;
        sql += ' AND SELITE LIKE "' + selite;
        
      }
      
      connection.query(sql, function(error, results){
        if ( error ){
          console.log("Virhe haettaessa dataa Asiakas-taulusta, syy: " + error);
          res.send({"status": 500, "error": error, "response": null}); 
        }
        else
        {
          res.send(results);
        }
    });
    },


    fetchAll: function(req, res){
      
      var sql = 'SELECT * FROM asiakas';
      if(Object.keys(req.query).length != 0){
        var nimi = req.query.NIMI;
        var osoite = req.query.OSOITE;
        var asty = req.query.ASTY_AVAIN;
        sql += ' WHERE NIMI LIKE "' + nimi + '%"';
        sql += ' AND OSOITE LIKE "' + osoite + '%"';
        sql += ' AND ASTY_AVAIN LIKE ' + asty;      
      }
       
        connection.query(sql, function(error, results){
          if ( error ){
            console.log("Virhe haettaessa dataa Asiakas-taulusta, syy: " + error);
            res.send({"status": 500, "error": error, "response": null}); 
          }
          else
          {
            res.send(results);
          }
      });
    },

    update: function(req, res){
      console.log(req.body.NIMI);
      if(Object.keys(req.body).length !== 0){
        var avain = req.body.AVAIN;
        var nimi = req.body.NIMI;
        var osoite = req.body.OSOITE;
        var postinro = req.body.POSTINRO;
        var postitmp = req.body.POSTITMP;
        var asty_avain = req.body.ASTY_AVAIN;
        var sql = 'UPDATE asiakas SET NIMI = "' + nimi + 
                  '", OSOITE = "' + osoite + 
                  '", POSTINRO = "' + postinro + 
                  '", POSTITMP = "' + postitmp + 
                  '", ASTY_AVAIN = "' + asty_avain + 
                  '" WHERE AVAIN = "' + avain + '"';
        connection.query(sql, function(err, res){
          if(err) throw err;
          else console.log("!!!!SUCCESSS!!!!");
        })
      }
    },

    create: function(req, res){
      
      var nimi = req.body.nimi;
      var osoite = req.body.osoite;
      var postinro = req.body.postinro;
      var postitmp = req.body.postitmp;
      var asty = req.body.asty_avain;      
      var sql = 'INSERT INTO asiakas VALUES(null, "' + nimi + '", "' + osoite + '", "' + postinro + '", "' + postitmp + '", ' + "CURDATE()" + ', ' + asty + ')';
      
      if(nimi != "" && osoite != "" && postinro != "" && postitmp != "" && asty != 0){
      //if(Object.keys(req.query).length !== 0 ){
      connection.query(sql, function(error, results){
        if ( error ){
          console.log("Virhe haettaessa dataa Asiakas-taulusta, syy: " + error);
          // res.jsonp({success : false, "error" : error});
           res.send({"status": 500, "error": error, "response": null});               
        }
        else
        {
          console.log("lisääminen onnistui");          
          res.send(results);
        }
      })
    }
    else {
      console.log("Ei onnistunu lisäys");
      res.status(400).json({
        Error : "Täytä kaikki kentät ni avittaa"
      });
    }

    },


}
