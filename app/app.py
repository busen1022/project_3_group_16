from flask import Flask, jsonify, render_template
import pandas as pd
import numpy as np
from sqlHelper import SQLHelper
from datetime import datetime
import matplotlib.dates as mdates
import logging

logging.basicConfig(level=logging.DEBUG)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)
sql = SQLHelper()

#################################################
# Flask Routes
#################################################

# HTML ROUTES
@app.route("/")
def index():
    return render_template("home.html")

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")



# CHECK THIS ONE - def map()?


@app.route("/histogram")
def histogram():
    return render_template("histogram.html")

@app.route("/about_us")
def about_us():
    return render_template("about_us.html")

@app.route("/works_cited")




# CHANGED NEXT LINE TO WORKS_CITED FROM ABOUT_US


def works_cited():
    return render_template("works_cited.html")

# SQL Queries
@app.route("/api/v1.0/get_dashboard/<min_stars>")
def get_dashboard(min_stars):
    min_stars = int(min_stars) # cast to int

    donut_data = sql.get_donut(min_stars)
    table_data = sql.get_table(min_stars)
    map_data = sql.get_map(min_stars)

    data = {
        "donut_data": donut_data,
        "table_data": table_data,
        "map_data": map_data
    }
    return(jsonify(data))

@app.route("/api/v1.0/get_histogram/<restaurant>")
def get_histogram(restaurant):
    # try:
        logging.debug(f"Request received for restaurant: {restaurant}")
                      
        # Fetch histogram data
        histogram_data = sql.get_histogram(restaurant)
        
        # Return the data as JSON
        return jsonify(histogram_data)
    

# Run the App
if __name__ == '__main__':
    app.run(debug=True)
