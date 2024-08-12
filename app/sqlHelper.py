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
            params = {}
        else:
            where_clause = "name = :restaurant"
            params = {"restaurant": restaurant}

        
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