import pandas as pd
from typing import Dict, List
from datetime import datetime
import logging
from decimal import Decimal

def parse_csv_transactions(file_path: str) -> Dict:
    """Parse CSV file and return data in dashboard-compatible format"""
    try:
        # Read CSV file
        df = pd.read_csv(file_path)
        
        # Standardize column names (adjust these based on your CSV format)
        required_columns = {
            'Date': ['date', 'transaction_date', 'Date'],
            'Description': ['description', 'desc', 'Description', 'Merchant'],
            'Amount': ['amount', 'Amount', 'Transaction Amount'],
            'Category': ['category', 'Category', 'Transaction Category']
        }
        
        # Map CSV columns to standard names
        column_mapping = {}
        for standard_name, possible_names in required_columns.items():
            found_column = next((col for col in possible_names if col in df.columns), None)
            if not found_column:
                raise ValueError(f"Could not find column for {standard_name}")
            column_mapping[found_column] = standard_name
            
        df = df.rename(columns=column_mapping)
        
        # Convert amounts to numeric, handling different formats
        df['Amount'] = df['Amount'].replace('[\$,)]', '', regex=True)
        df['Amount'] = df['Amount'].replace('[(]', '-', regex=True)
        df['Amount'] = pd.to_numeric(df['Amount'], errors='coerce')
        
        # Calculate summary data
        total_income = float(df[df['Amount'] > 0]['Amount'].sum())
        total_expenses = abs(float(df[df['Amount'] < 0]['Amount'].sum()))
        balance = total_income - total_expenses
        
        # Calculate expenses by category
        expenses_by_category = (
            df[df['Amount'] < 0]
            .groupby('Category')['Amount']
            .sum()
            .abs()
            .to_dict()
        )
        
        # Identify recurring transactions
        def identify_recurring(group):
            if len(group) >= 2:  # At least 2 occurrences
                return True
            return False
        
        recurring_mask = (
            df[df['Amount'] < 0]
            .groupby(['Description', 'Amount'])
            .filter(identify_recurring)
        )
        
        recurring_expenses = [
            {
                'date': row['Date'],
                'description': row['Description'],
                'amount': abs(float(row['Amount'])),
                'category': row['Category'],
                'isRecurring': True,
                'type': 'expense'
            }
            for _, row in recurring_mask.iterrows()
        ]
        
        # Format data for dashboard
        dashboard_data = {
            'totalIncome': total_income,
            'totalExpenses': total_expenses,
            'balance': balance,
            'expensesByCategory': expenses_by_category,
            'recurringExpenses': recurring_expenses
        }
        
        return dashboard_data
        
    except FileNotFoundError:
        logging.error(f"CSV file not found: {file_path}")
        raise
    except pd.errors.EmptyDataError:
        logging.error("CSV file is empty")
        raise
    except Exception as e:
        logging.error(f"Error parsing CSV file: {str(e)}")
        raise

def validate_dashboard_data(data: Dict) -> bool:
    """Validate that the data meets the dashboard's requirements"""
    required_keys = [
        'totalIncome', 
        'totalExpenses', 
        'balance', 
        'expensesByCategory', 
        'recurringExpenses'
    ]
    
    try:
        # Check all required keys exist
        for key in required_keys:
            if key not in data:
                logging.error(f"Missing required key: {key}")
                return False
        
        # Validate numeric values
        if not all(isinstance(data[key], (int, float)) 
                  for key in ['totalIncome', 'totalExpenses', 'balance']):
            logging.error("Invalid numeric values in summary data")
            return False
        
        # Validate expensesByCategory
        if not isinstance(data['expensesByCategory'], dict):
            logging.error("expensesByCategory must be a dictionary")
            return False
        
        # Validate recurringExpenses
        if not isinstance(data['recurringExpenses'], list):
            logging.error("recurringExpenses must be a list")
            return False
            
        return True
        
    except Exception as e:
        logging.error(f"Validation error: {str(e)}")
        return False 