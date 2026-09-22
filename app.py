

from flask import Flask, render_template, request, jsonify, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
import json
import os

# Determine the absolute directory path of the current file
basedir = os.path.abspath(os.path.dirname(__file__))

# Create the Flask app

app = Flask(__name__)

# Use a relative path anchored to the project folder
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'instance', 'company.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Database classes
class Company(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    limited_company = db.Column(db.Integer, nullable=False)

class Year(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('company.id'), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    revenue = db.Column(db.Float)
    openinginv = db.Column(db.Float)
    purchases = db.Column(db.Float)
    purchasereturns = db.Column(db.Float)
    carriageinwards = db.Column(db.Float)
    closinginv = db.Column(db.Float)
    expenses = db.Column(db.Text)  # JSON encoded
    sundryincome = db.Column(db.Text)  # JSON encoded
    financecosts = db.Column(db.Float)
    tax = db.Column(db.Float)
    NCA = db.Column(db.Text)  # JSON encoded
    NCL = db.Column(db.Text)  # JSON encoded
    CA = db.Column(db.Text)  # JSON encoded
    CL = db.Column(db.Text)  # JSON encoded
    ISC = db.Column(db.Text)  # JSON encoded
    CR = db.Column(db.Text)  # JSON encoded
    RR = db.Column(db.Text)  # JSON encoded
    openingcapital = db.Column(db.Float)
    drawings = db.Column(db.Float)


@app.route('/')
def index():
    #Specifies company ID and year of statement data to fetch
    # Get company_id and year from URL parameters
    company_id = request.args.get('company_id', default=1, type=int)
    year = request.args.get('year', default=2021, type=int)
    
    company = Company.query.get(company_id)
    year_data = Year.query.filter_by(company_id=company_id, year=year).first()
    
    # Get all company id's and name and create an array
    companies = Company.query.all()
    companyoptions = []

    # Create a list of companies and their years
    for company in companies:
        years = Year.query.filter_by(company_id=company.id).all()
        year_list = [year.year for year in years]
        companyoptions.append([company.id, company.name, year_list])



    # Prepare data to be sent to the template
    data = {
        'revenue': year_data.revenue, 
        'openinginv': year_data.openinginv,
        'purchases': year_data.purchases,
        'purchasereturns': year_data.purchasereturns,
        'carriageinwards': year_data.carriageinwards,
        'closinginv': year_data.closinginv,
        'expenses': json.loads(year_data.expenses),
        'sundryincome': json.loads(year_data.sundryincome),
        'companyoptions': companyoptions
    }
    
    # Add finance costs and tax if company is a limited company
    if company.limited_company:
        new_data = {
            'financecosts': year_data.financecosts,
            'tax': year_data.tax,
            'limitedCompany': 1
        }
        data.update(new_data)
    else:
        new_data = {
            'financecosts': 0,
            'tax': 0,
            'limitedCompany': 0
        }
        data.update(new_data)
    
    new_data = {
        'NCA': json.loads(year_data.NCA),
        'NCL': json.loads(year_data.NCL),
        'CA': json.loads(year_data.CA),
        'CL': json.loads(year_data.CL),
    }
    data.update(new_data)


    # Add ISC, CR, RR, opening capital and drawings if company is a limited company
    if company.limited_company:
        new_data = {
            'ISC': json.loads(year_data.ISC),
            'CR': json.loads(year_data.CR),
            'RR': json.loads(year_data.RR),
            'openingcapital': 0,
            'drawings': 0    
        }
        data.update(new_data)
    else:
        new_data = {
            'ISC': [[]],
            'CR': [[]],
            'RR': [[]],
            'openingcapital': year_data.openingcapital,
            'drawings': year_data.drawings    
        }
        data.update(new_data)

    print(data)

    # Render the template with the data
    return render_template('index.html', data=data)


@app.route('/editor')
def editor():
    company_id = request.args.get('company_id', default=1, type=int)
    year = request.args.get('year', default=2021, type=int)
    
    company = Company.query.get(company_id)
    year_data = Year.query.filter_by(company_id=company_id, year=year).first()
    
    # Get all company id's and name and create an array
    companies = Company.query.all()
    companyoptions = []

    for company in companies:
        years = Year.query.filter_by(company_id=company.id).all()
        year_list = [year.year for year in years]
        companyoptions.append([company.id, company.name, year_list])

    print("Company Options")
    print(companyoptions)
    print(isinstance(companyoptions, str))

    # Prepare data to be sent to the template
    data = {
        'revenue': year_data.revenue, 
        'openinginv': year_data.openinginv,
        'purchases': year_data.purchases,
        'purchasereturns': year_data.purchasereturns,
        'carriageinwards': year_data.carriageinwards,
        'closinginv': year_data.closinginv,
        'expenses': json.loads(year_data.expenses),
        'sundryincome': json.loads(year_data.sundryincome),
        'companyoptions': companyoptions
    }
    

    if company.limited_company:
        new_data = {
            'financecosts': year_data.financecosts,
            'tax': year_data.tax,
            'limitedCompany': 1
        }
        data.update(new_data)
    else:
        new_data = {
            'financecosts': 0,
            'tax': 0,
            'limitedCompany': 0
        }
        data.update(new_data)
    
    new_data = {
        'NCA': json.loads(year_data.NCA),
        'NCL': json.loads(year_data.NCL),
        'CA': json.loads(year_data.CA),
        'CL': json.loads(year_data.CL),
    }
    data.update(new_data)

    if company.limited_company:
        new_data = {
            'ISC': json.loads(year_data.ISC),
            'CR': json.loads(year_data.CR),
            'RR': json.loads(year_data.RR),
            'openingcapital': 0,
            'drawings': 0    
        }
        data.update(new_data)
    else:
        new_data = {
            'ISC': [],
            'CR': [],
            'RR': [],
            'openingcapital': year_data.openingcapital,
            'drawings': year_data.drawings    
        }
        data.update(new_data)

    newcompanyname = request.args.get('newcompanyname')
    newyear = request.args.get('newyear')
    addednewyear = request.args.get('addednewyear')
    deleteyear = request.args.get('deleteyear')
    deletecompany = request.args.get('deletecompany')

    if newcompanyname and newyear:
        print("New Company and Year")
        print(newcompanyname)
        print(newyear)
        company = Company(name=newcompanyname, limited_company=0)
        db.session.add(company)
        db.session.commit()
        year = Year(company_id=company.id, year=newyear, revenue=0, openinginv=0, purchases=0, purchasereturns=0, carriageinwards=0, closinginv=0, expenses='[]', sundryincome='[]', financecosts=0, tax=0, NCA='[]', NCL='[]', CA='[]', CL='[]', ISC='[]', CR='[]', RR='[]', openingcapital=0, drawings=0)
        db.session.add(year)
        db.session.commit()

        # Remove newcompanyname and newyear from URL
        args = request.args.to_dict()
        args.pop('newcompanyname', None)
        args.pop('newyear', None)
        return redirect(url_for(request.endpoint, **args))
    
    if addednewyear:
        print("Added New Year")
        print(addednewyear)
        year = Year(company_id=company_id, year=addednewyear, revenue=0, openinginv=0, purchases=0, purchasereturns=0, carriageinwards=0, closinginv=0, expenses='[]', sundryincome='[]', financecosts=0, tax=0, NCA='[]', NCL='[]', CA='[]', CL='[]', ISC='[]', CR='[]', RR='[]', openingcapital=0, drawings=0)
        db.session.add(year)
        db.session.commit()

        # Remove addednewyear from URL
        args = request.args.to_dict()
        args.pop('addednewyear', None)
        return redirect(url_for(request.endpoint, **args))
    
    if deleteyear:
        deletecompany = request.args.get('deletecompanyid')
        print("Delete Year")
        print(deleteyear)
        year = Year.query.filter_by(company_id=deletecompany, year=deleteyear).first()
        
        if year is not None:
            db.session.delete(year)
            db.session.commit()
        else:
            print("Year not found")

        # Remove addednewyear from URL
        args = request.args.to_dict()
        args.pop('deleteyear', None)
        return redirect(url_for(request.endpoint, **args))
    
    if deletecompany:
        print("Delete Company")
        print(deletecompany)
        company = Company.query.get(deletecompany)
        db.session.delete(company)
        db.session.commit()

        return redirect('http://127.0.0.1:5000/editor')
    
    
    return render_template('editor.html', data=data)

@app.route('/alterstatement')
def alter():
    revenue = request.args.get('revenue')
    openinginv = request.args.get('openinginv')
    purchases = request.args.get('purchases')
    purchasesreturns = request.args.get('purchasesreturns')
    carriageinwards = request.args.get('carriageinwards')
    closinginv = request.args.get('closinginv')
    financecosts = request.args.get('financecosts')
    tax = request.args.get('tax')
    ISC = request.args.get('ISC')
    CR = request.args.get('CR')
    RR = request.args.get('RR')
    NCA = request.args.get('NCA')
    CA = request.args.get('CA')
    CL = request.args.get('CL')
    NCL = request.args.get('NCL')
    imported_sundryincome = request.args.get('sundryincome')
    imported_expenses = request.args.get('expenses')
    limitedcompany = request.args.get('limitedcompany')
    openingcapital = request.args.get('openingcapital')
    drawings = request.args.get('drawings')
    companyid = request.args.get('companyid')
    year = request.args.get('year')

    # Check if company exists
    company = Company.query.filter_by(id=companyid).first()
    if not company:
        # Create new company
        company = Company(id=companyid, limitedcompany=limitedcompany)
        db.session.add(company)
        db.session.commit()

    # Check if year exists
    year_record = Year.query.filter_by(company_id=companyid, year=year).first()
    if year_record:
        # Update existing year
        year_record.revenue = revenue
        year_record.openinginv = openinginv
        year_record.purchases = purchases
        year_record.purchasereturns = purchasesreturns
        year_record.carriageinwards = carriageinwards
        year_record.closinginv = closinginv
        year_record.financecosts = financecosts
        year_record.tax = tax
        year_record.ISC = ISC
        year_record.CR = CR
        year_record.RR = RR
        year_record.NCA = NCA
        year_record.CA = CA
        year_record.CL = CL
        year_record.NCL = NCL
        year_record.sundryincome = imported_sundryincome
        year_record.expenses = imported_expenses
        year_record.openingcapital = openingcapital
        year_record.drawings = drawings
    else:
        # Create new year
        year_record = Year(company_id=companyid, year=year, revenue=revenue, openinginv=openinginv, purchases=purchases, purchasereturns=purchasesreturns, carriageinwards=carriageinwards, closinginv=closinginv, financecosts=financecosts, tax=tax, ISC=ISC, CR=CR, RR=RR, NCA=NCA, CA=CA, CL=CL, NCL=NCL, sundryincome=imported_sundryincome, expenses=imported_expenses, openingcapital=openingcapital, drawings=drawings)
        db.session.add(year_record)

    db.session.commit()

    return redirect('http://127.0.0.1:5000/editor')

@app.route('/quiz')
def quiz():
    quiz_directory = os.path.join(basedir, 'instance', 'quizzes')
    num_files = len([f for f in os.listdir(quiz_directory) if os.path.isfile(os.path.join(quiz_directory, f))])
    print(f"Number of quiz files: {num_files}")

    
    data = []
    for i in range(0, num_files):
        quiz_file = os.path.join(basedir, 'instance', 'quizzes', f'quiz{i}.json')
        with open(quiz_file, 'r') as file:
            quiz_data = json.load(file)
            numberofquestions = len([q['question'] for q in quiz_data['questions']])
            data.append([quiz_data['name'], quiz_data['previous_score'], numberofquestions, quiz_data['id']])

    
    return render_template('quiz.html', data=data)

@app.route('/quizpage')
def quizpage():
    id = request.args.get('id', default=1)

    quiz_file = os.path.join(basedir, 'instance', 'quizzes', f'quiz{id}.json')
    with open(quiz_file, 'r') as file:
        quiz_data = json.load(file)
    
    previous_score = quiz_data['previous_score']
    questions = [q['question'] for q in quiz_data['questions']]
    answers = [q['answer'] for q in quiz_data['questions']]

    data = {
        'questions': questions,
        'answers': answers,
        'previous_score': previous_score
    }

    return render_template('quizpage.html', data=data)

@app.route('/quizupdatescore')
def quizupdatescore():
    id = request.args.get('id', default=1)
    new_score = request.args.get('NewScore', type=int)

    quiz_file = os.path.join(basedir, 'instance', 'quizzes', f'quiz{id}.json')
    with open(quiz_file, 'r') as file:
        quiz_data = json.load(file)
    
    quiz_data['previous_score'] = new_score

    with open(quiz_file, 'w') as file:
        json.dump(quiz_data, file)

    return redirect(url_for('quiz'))


if __name__ == "__main__":
    app.run(debug=True)