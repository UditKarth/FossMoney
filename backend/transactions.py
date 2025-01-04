import requests
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta
from typing import Dict, List
import time
import logging

load_dotenv() 

API_BASE_URL = os.getenv("API_BASE_URL")
API_CLIENT_ID = os.getenv("API_CLIENT_ID")
API_CLIENT_SECRET = os.getenv("API_CLIENT_SECRET")

# Rate limiting configuration
MAX_REQUESTS_PER_MINUTE = 30
request_timestamps: List[datetime] = []

class APIError(Exception):
    """Custom exception for API-related errors"""
    pass

def check_rate_limit():
    """Implement rate limiting using sliding window"""
    current_time = datetime.now()
    # Remove timestamps older than 1 minute
    while request_timestamps and current_time - request_timestamps[0] > timedelta(minutes=1):
        request_timestamps.pop(0)
    
    if len(request_timestamps) >= MAX_REQUESTS_PER_MINUTE:
        sleep_time = 60 - (current_time - request_timestamps[0]).seconds
        time.sleep(sleep_time)
    
    request_timestamps.append(current_time)

def fetch_transactions(access_token, account_id):
    """Fetch transactions with error handling and rate limiting"""
    try:
        check_rate_limit()
        
        url = f"{API_BASE_URL}/accounts/{account_id}/transactions"
        headers = {"Authorization": f"Bearer {access_token}"}
        
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code == 429:  # Too Many Requests
            retry_after = int(response.headers.get('Retry-After', 60))
            time.sleep(retry_after)
            return fetch_transactions(access_token, account_id)
            
        response.raise_for_status()
        return response.json()
        
    except requests.exceptions.Timeout:
        logging.error("Request timed out while fetching transactions")
        raise APIError("Request timed out")
    except requests.exceptions.RequestException as e:
        logging.error(f"Error fetching transactions: {str(e)}")
        raise APIError(f"API request failed: {str(e)}")
    except ValueError as e:
        logging.error(f"Error parsing JSON response: {str(e)}")
        raise APIError("Invalid response format")

def identify_recurring_expenses(transactions):
    """Identify recurring expenses with error handling"""
    try:
        recurring = {}
        for transaction in transactions:
            try:
                merchant = transaction.get("merchant")
                amount = transaction.get("amount")
                
                if not merchant or not amount:
                    logging.warning(f"Skipping transaction with missing data: {transaction}")
                    continue
                    
                key = (merchant, amount)
                if key not in recurring:
                    recurring[key] = []
                recurring[key].append(transaction)
                
            except (KeyError, TypeError) as e:
                logging.warning(f"Error processing transaction: {str(e)}")
                continue
                
        return {k: v for k, v in recurring.items() if len(v) > 1}
        
    except Exception as e:
        logging.error(f"Error in identify_recurring_expenses: {str(e)}")
        raise APIError(f"Failed to process transactions: {str(e)}")
