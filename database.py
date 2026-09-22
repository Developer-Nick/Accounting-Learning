from app import app, db, Company, Year  # Adjust according to your file structure

with app.app_context():
    db.create_all()
    print("All tables created successfully.")

    # Populate database with initial data
    company = Company(name="Microsoft", limited_company=1)
    #db.session.add(company)
    #db.session.commit()

    year_data = Year(
        company_id=1,
        year=2023,
        revenue=100500.0,
        openinginv=1000.0,
        purchases=26000.0,
        purchasereturns=520.0,
        carriageinwards=120.0,
        closinginv=1000.0,
        expenses='[["interest", 1240.0], ["depreciation", 250.0], ["Computer expenses", 25000.0]]',
        sundryincome='[["interest", 56.0]]',
        financecosts=55.0,
        tax=240.0,
        NCA='[["property", 200000.0, 20000.0, 180000.0], ["Computers", 18000.0, 6000.0, 12000.0]]',
        NCL='[["long_term_loans", 9200.0]]',
        CA='[["Trade recievables", 2260.0]]',
        CL='[["short_term_loans", 1000.0]]',
        ISC='[["share_capital", 5500.0]]',
        CR='[["retained_earnings", 10000.0]]',
        RR='[["reserves", 2000.0]]',
        openingcapital=0.0,
        drawings=0.0
    )
    db.session.add(year_data)
    db.session.commit()

    print("Database populated successfully.")

from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///company.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
