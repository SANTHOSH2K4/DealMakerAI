from flask import Flask, render_template, request, jsonify, redirect
import google.generativeai as genai
from secret_key import Gemini_api_key
from fuzzywuzzy import fuzz
from textblob import TextBlob
import json

app = Flask(__name__)

products = {
    'milk bikis': {'min_price': 8, 'initial_price': 10},
    'biscuits': {'min_price': 10, 'initial_price': 15},
    'chocolate': {'min_price': 20, ' initial_price': 50},
    'chips': {'min_price': 20, 'initial_price': 30},
    'soft drink': {'min_price': 25, 'initial_price': 35},
    'cereal': {'min_price': 35, 'initial_price': 45},
    'coffee': {'min_price': 45, 'initial_price': 60},
    'tea': {'min_price': 14, 'initial_price': 25,},
    'cake': {'min_price': 70, 'initial_price': 100},
    'bread': {'min_price': 15, 'initial_price': 25},
    'fruit juice': {'min_price': 19, 'initial_price': 30},
    'yogurt': {'min_price': 10, 'initial_price': 20},
    'pasta': {'min_price': 15, 'initial_price': 30},
    'rice': {'min_price': 50, 'initial_price': 70},
    'spices': {'min_price': 38, 'initial_price': 50},
    'none':'none'
    }   


def initialize_gemini():
    api_key = Gemini_api_key
    genai.configure(api_key=api_key)
    return genai.GenerativeModel('gemini-pro').start_chat(history=[])


chat = initialize_gemini()


product=['','']
memory = ['']

def generate_response(prompt, chat):
    combined_prompt = memory[0] + 'this is my conversation memory, now gimme reply for the following query (based on the memory or context i provided): '+prompt
    response = chat.send_message(combined_prompt)
    generated_text = response.text
    prompt=prompt.split("--")[0]
    print('\n\n',prompt,'\n\n')
    memory[0] += "\nUser: " + prompt + "\nAI Assistant: " + generated_text
    return generated_text, memory[0]

def switch_to_new_prod(user_input):  
    max_similarity = 0
    best_match = None
    user_input_lower = user_input.lower()

    for product in products.keys():
        similarity = fuzz.token_set_ratio(product.lower(), user_input_lower)
        if similarity > max_similarity:
            max_similarity = similarity
            best_match = product

    if max_similarity >= 95:
        return best_match
    else:
        return None

def map_product(user_input):
    max_similarity = 0
    best_match = None
    user_input_lower = user_input.lower()

    for product in products.keys():
        similarity = fuzz.token_set_ratio(product.lower(), user_input_lower)
        if similarity > max_similarity:
            max_similarity = similarity
            best_match = product

    if max_similarity >= 30:
        return best_match
    else:
        return None
    
def analyze_sentiment(text):
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity

    if polarity > 0.5:
        return "Happy"
    elif polarity > 0:
        return "Neutral"
    elif polarity < -0.5:
        return "Angry"
    elif polarity < 0:
        return "Sad"
    else:
        return "Neutral"



def suggest_queries(user_query):
    combined_prompt = "now you should act like a query suggetor so suggest similar or next possible query which will be asked by the customer to the assistant,so suggest similar query to the following user query, " + user_query+"note: you should suggest only one with one sentenced query as response, also note that it is negotiator hence the query should be based on negotiating offers for the customers the query should be based only on the offer proposals, just gimme the query alone without any mentions "
    response = chat.send_message(combined_prompt)
    generated_text = response.text  
    return generated_text


@app.route('/')
def bot():
    return render_template('index.html')



@app.route('/sol/', methods=['POST'])
def send():
    if request.method == 'POST':
        data = json.loads(request.data)
        user_input = data.get('message')
        mem_clear=False

        if(product[1]==''):
            product[1]=switch_to_new_prod(user_input)
            mem_clear=True

        if(switch_to_new_prod(user_input)!=None and switch_to_new_prod(user_input)!='none' and product[1]!='' and product[1]!=switch_to_new_prod(user_input)):
            product[0]=product[1]
            product[1]=switch_to_new_prod(user_input)
            mem_clear=True
        print("\n\nProduct",product,'\n\n')

        if mem_clear and product[1]!='None':
            print("Product switching: to ", product[1])
            min_price = products[product[1]]['min_price']
            initial_price=products[product[1]]['initial_price']
            memory[0] = f"""
        You are a negotiation assistant acting as a supplier in a product price negotiation.
        The customer will propose a price for the product '{product[1]}', and your goal is to either accept, reject, or counteroffer based on their input.
        The initial price is {initial_price}rs. 
        If the customer offers a reasonable price within or equal to the range of {min_price}rs and {initial_price}rs, you can accept the offer without any further negotiation.
        If the offer is too low (below {min_price}rs), you should suggest a higher counteroffer, and if it's too high (above {initial_price}rs), politely reject the offer.
        Additionally, provide reasons for your decisions to make the conversation feel natural and professional.
        Also, note that this is not an email communication, so give replies like a chatbot assistant for the negotiation task, also dont say the price range accepted at first for better negotiation tasks.
        """
            print(f"\nlets switch our discussion to {product}...")
            c1=f"\nlets switch our discussion to {product[1]}..."
            response, memory[0] = generate_response(user_input, chat)
            c1+=response
            sugg1=suggest_queries(user_input)
            sugg2=suggest_queries(sugg1)
            return jsonify({'user_input': user_input, 'bot_response': c1, 'sugg1': sugg1, 'sugg2': sugg2})
        
        sentiment = analyze_sentiment(user_input)
        user_input+=f'--note: user is in {sentiment} mood, so reply accordingly, also note that if the price user negotiating is greater than or equal to minimum price of the product, accept the offer if within the price range, dont give counter offer if it is lower than the minimum price'
        response, memory[0] = generate_response(user_input, chat)
        c1=response

        sugg1=suggest_queries(user_input)
        sugg2=suggest_queries(sugg1)

        return jsonify({'user_input': user_input, 'bot_response': c1, 'sugg1': sugg1, 'sugg2': sugg2})


if __name__ == '__main__':
    app.run(debug=True)
