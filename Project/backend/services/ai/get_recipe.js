const axios = require("axios");


const get_recipe = async (calories, fat, carbohydrates, protein, cholesterol, sodium, fiber, ingredients) => {
    response = {
        status: false,
        message: "AI Response Failed",
        recipe: ""
    }

    request = {
        calories, fat, carbohydrates, protein, cholesterol, sodium, fiber, ingredients
    }

    //Application of discrete 1 , demorgans law :)
    try {
        if(!(calories && fat && carbohydrates && protein && cholesterol && sodium && fiber && ingredients)) {
            response.message = "One or more inputs are empty";
            return response;
        }

        const recipe = await axios.get("http//:127.0.0.1:5004/ai-model");

        console.log(recipe);

        return

        // will added parsing for recipe soon
        
        return response
    }catch (err) {
        console.log(err);
        response.message = "Internal Error"
        return response;
    }
}

module.exports = { get_recipe };