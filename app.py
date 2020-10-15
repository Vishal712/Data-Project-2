from flask import Flask, render_template, redirect
import pymongo
import pandas as pd
import get_data

app = Flask(__name__)

@app.route("/")
def index():
    # write a statement that finds all the items in the db and sets it to a variable
    #inventory = list(produce.find())
    #print(inventory)

    # render an index.html template and pass it the data you retrieved from the database
    return render_template("index.html")

@app.route("/data")
def data():
    return render_template("datapage.html")

@app.route("/profile")
def profile():
    return render_template("updatedprofile.html")


@app.route("/scrape")
def scrape():
    conn = 'mongodb://localhost:27017'
    client = pymongo.MongoClient(conn)

    # Declare the database
    db = client.NBA_NCAA

    # Get the collection from mongo
    NBA = db.NBA
    NCAA = db.NCAA
    NBA_Location = db.NBA_Location


    #get all entries in the collection and add to a list
    NBA_list = pd.DataFrame(list(NBA.find()))
    NCAA_list = pd.DataFrame(list(NCAA.find()))
    NBA_location_list = pd.DataFrame(list(NBA_Location.find()))

    #Convert the lists of dictionaries to pandas df
    NBA_df_mongo = pd.DataFrame(NBA_list)
    NCAA_df_mongo = pd.DataFrame(NCAA_list)
    NBA_location_df_mongo = pd.DataFrame(NBA_location_list)

    NBA_df_mongo.to_csv('static/assets/data/NBAData.csv', index = False)
    NCAA_df_mongo.to_csv('static/assets/data/NCAAData.csv', index = False)
    NBA_location_df_mongo.to_csv('static/assets/data/NBALocation.csv', index = False)
    return redirect("/", code=302)
    

if __name__ == "__main__":
    app.run(debug=True)
