import sqlalchemy
# from sqlalchemy.ext.automap import automap_base
# from sqlalchemy.orm import Session
from sqlalchemy import create_engine, text, func
import datetime

import pandas as pd
import numpy as np

# The Purpose of this Class is to separate out any Database logic
class SQLHelper():
    #################################################
    # Database Setup
    #################################################

    # define properties
    def __init__(self):
        self.engine = create_engine("sqlite:///santa_barbara_food.sqlite")
        # self.Base = None

        # automap Base classes
        # self.init_base()

    # COMMENT BACK IN IF USING THE ORM

    # def init_base(self):
    #     # reflect an existing database into a new model
    #     self.Base = automap_base()
    #     # reflect the tables
    #     self.Base.prepare(autoload_with=self.engine)

    #################################################
    # Database Queries
    #################################################

    # USING RAW SQL
    def get_histogram(self, restaurant):

        if restaurant == "ALL":
            where_clause = "1=1"
        else:
            where_clause = "name = :restaurant"


        # # Sub in for next commented area
        # start_clause = '2021-01-01' if start_date == "ALL" else start_date
        # end_clause = '2022-01-19' if end_date == "ALL" else end_date
        
        
        
        
        # if start_date == "ALL":
        #     start_clause = '2021-01-01'
        # else:
        #     start_clause = ":start_date"

        # if end_date == "ALL":
        #     end_clause = '2022-01-19'
        # else:
        #     end_clause = ":end_date"



        # build the query
        query = f"""
                    SELECT
                        name,
                        review_stars,
                        date
                    FROM
                        santa_barbara_food
                    WHERE
                        {where_clause}
                        AND date BETWEEN '2021-01-01' AND '2022-01-19'
                    ORDER BY
                        name
                """

        # Added in with sub 2 above
        params = {
        "restaurant": restaurant
        # "start_date": start_clause,
        # "end_date": end_clause
        }

        df = pd.read_sql(text(query), con = self.engine, params=params)
        data = df.to_dict(orient="records")
        return(data)

   def get_donut(self, min_stars=0):

        # build the query
        query = f"""
                    SELECT 
                        categories, 
                        COUNT(*) as count
                    FROM 
                        santa_barbara_food
                    WHERE 
                        stars >= {min_stars}
                    GROUP BY 
                        categories
                    ORDER BY 
                        count DESC;
                """

        df = pd.read_sql(text(query), con = self.engine)
        data = df.to_dict(orient="records")
        return(data)

    def get_table(self, min_stars=0):

        # build the query
        query = f"""
                    SELECT DISTINCT
                        name,
                        address,
                        categories as category,
                        latitude,
                        longitude,
                        stars,
                        review_count as total_reviews
                    FROM
                        santa_barbara_food
                    WHERE
                        stars >= {min_stars}
                    ORDER BY
                        stars DESC;
                """

        df = pd.read_sql(text(query), con = self.engine)
        data = df.to_dict(orient="records")
        return(data)

    def get_map(self, min_stars=0):

        # build the query
        query = f"""
                    SELECT DISTINCT
                        name,
                        address,
                        categories as category,
                        latitude,
                        longitude,
                        stars,
                        review_count as total_reviews
                    FROM
                        santa_barbara_food
                    WHERE
                        stars >= {min_stars}
                    ORDER BY
                        stars DESC;
                """

        df = pd.read_sql(text(query), con = self.engine)
        data = df.to_dict(orient="records")
        return(data)
