from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
from io import BytesIO
from PIL import Image
from openai import OpenAI
import json
import re

app = Flask(__name__, template_folder="templates", static_folder="static")
CORS(app)

client = OpenAI(api_key="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")

def parse_json_from_response(text):
    return json.loads(re.search(r'```json\s*(.*?)\s*```', text, re.DOTALL).group(1))

def compress_image(image_data, max_size=(800, 800), quality=85):
    image = Image.open(BytesIO(image_data))
    if image.mode in ("RGBA", "P", "LA"):
        image = image.convert("RGB")
    image.thumbnail(max_size)
    output = BytesIO()
    image.save(output, format="JPEG", quality=quality)
    return output.getvalue()

@app.route("/identify_car_details", methods=["POST"])
def identify_car_details():
    if "file" not in request.files:
        return jsonify({"status": "error", "message": "No file uploaded"}), 400

    file = request.files["file"]
    compressed_image = compress_image(file.read())
    encoded_image = base64.b64encode(compressed_image).decode("utf-8")
    json_req = """
    {
                "make": "Brand of the car or bike",
                "model": "Model of the car or bike",
                "color": "Color of the car or bike",
                "price": "market price of the vehicle in INR in Indian formatting",
                "number_plate": "if visible, else null",
                "fuel_type": "fuel type of the vehicle",
                "transmission": "transmission type of the vehicle",
    }
    """
    prompt_text = f"""You are vehicle model identifier. Identify the vehicle from the uploaded image and provide the details in the following JSON format:
    {json_req}
    If any part of the car or bike is not visible, set its value to null. Do not include any explanations—just the JSON output.
    Maintain the INR formatting in all the amount values.
    if car or bike is not detectable, then return the following JSON:
    {{
        "status": "error",
        "message": "car or bike not detectable"
    }}
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt_text},
                        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{encoded_image}"}},
                    ],
                }
            ],
            max_tokens=1000,
        )

        message = response.choices[0].message.content.strip()
        json1 = parse_json_from_response(message)
        return jsonify({"status": "success", "data": json1})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

    
@app.route("/identify_all_details", methods=["POST"])
def identify_image():
    if "file" not in request.files:
        return jsonify({"status": "error", "message": "No file uploaded"}), 400

    file = request.files["file"]
    compressed_image = compress_image(file.read())
    encoded_image = base64.b64encode(compressed_image).decode("utf-8")
    make = request.form.get("make")
    model = request.form.get("model")
    year = request.form.get("year")
    kilometers = request.form.get("kilometers")
    fuel_type = request.form.get("fuel_type")
    number_plate = request.form.get("number_plate")
    json_req = """
    {
                "damages": {
                    "dent": {
                        "damage": int (0 to 100) out of full vehicle area,
                        "description": "Text description of the dent",
                        "type": "minor" | "major",
                        "repair_cost": "accurate Indian INR range with indian formatting",
                        "coordinates": [
                            {
                                "x1": int(0 to 100) => accurate starting point of the dent box,
                                "y1": int(0 to 100) => accurate starting point of the dent box,
                                "x2": int(0 to 100) => accurate ending point of the dent,
                                "y2": int(0 to 100) => accurate ending point of the dent,
                            }
                        ]
                    },
                    "scratch": {
                        "damage": int (0 to 100) out of full vehicle area,
                        "description": "Text description of the scratch",
                        "type": "minor" | "major",
                        "repair_cost": "accurate Indian INR range with indian formatting",
                        "coordinates": [
                            {
                                "x1": int(0 to 100) => accurate starting point of the dent box,
                                "y1": int(0 to 100) => accurate starting point of the dent box,
                                "x2": int(0 to 100) => accurate ending point of the dent,
                                "y2": int(0 to 100) => accurate ending point of the dent,
                            }
                        ]
                    },
                    "headlight": {
                        "damage": int (0 to 100) out of full vehicle area,
                        "description": "Text description of the headlight",
                        "type": "minor" | "major",
                        "repair_cost": "accurate Indian INR range with indian formatting",
                        "coordinates": [
                           {
                                "x1": int(0 to 100) => accurate starting point of the dent box,
                                "y1": int(0 to 100) => accurate starting point of the dent box,
                                "x2": int(0 to 100) => accurate ending point of the dent,
                                "y2": int(0 to 100) => accurate ending point of the dent,
                            }
                        ]
                    }
                },
                "plate_number": "if visible, else null",
                "legal_status": {
                    "insurance": {
                        "status": "valid" | "invalid (generate randomly)",
                        "expiry_date": "date of expiry (generate randomly)",
                        "insurance_company": "name of the insurance company (generate randomly)",
                        "policy_number": "insurance policy number (generate randomly)"
                    },
                    "registration": {
                        "status": "valid" | "invalid (generate randomly)",
                        "expiry_date": "date of expiry (generate randomly)",
                        "registration_number": "registration number (generate randomly)"
                    },
                    "challans": [
                        {
                            "challan_number": "challan number (generate randomly)",
                            "fine_amount": "fine amount in INR formatting (generate randomly)",
                            "status": "paid" | "unpaid (generate randomly)",
                            "date": "date of the challan (generate randomly)"
                        },
                        (generate randomly more)
                    ],
                    "percentage": "int(0 to 100) based on insurance, registration and challan status",
                }
                "vehicle": {
                    "make": "Brand of the car",
                    "model": "Model of the car",
                    "color": "Color of the car",
                    "price": "market price of the vehicle in INR in Indian formatting",
                },
                "market_value_range": {
                    "low_price": "low price of the vehicle in INR",
                    "average_price": "average price of the vehicle in INR",
                    "high_price": "high price of the vehicle in INR",
                    "recommended_price": "worth of the vehicle in INR deducting the repair cost and condition of the vehicle"
                },
                "physical_condition": int (0 to 100) depending on the damage of the vehicle,
                "total_repair_cost": "sum range of all repairs in INR"
            }
    """
    prompt_text = f"""
            You are a vehicle damage analyzer and repair cost suggester. Identify the vehicle and any visible damage from the uploaded image.
            this is my vehicle details:
            make: {make}
            model: {model}
            year: {year}
            kilometers: {kilometers}
            fuel_type: {fuel_type}
            number_plate: {number_plate}
            Provide the analysis in the following JSON format:
            {json_req}
            If any part of the car is not visible, set its value to null. If any damage is not visible, don't show it in the output JSON. Use real latest Indian repair cost estimates. if the car is a big branded car, then the repair costs should be very expensive. Do not include any explanations—just the JSON output.
            maintain the INR formatting in all the amount values.
            """

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt_text},
                        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{encoded_image}"}},
                    ],
                }
            ],
            max_tokens=1000,
        )

        message = response.choices[0].message.content.strip()
        json1 = parse_json_from_response(message)
        return jsonify({"status": "success", "data": json1})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
