const mongoose = require("mongoose");

require("dotenv").config({
    path: "../.env",
});

// Create Template Schema

const templateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    components: {
        type: Object,
        required: true,
    },
});

const inititalTemplates = [
    {
        name: "Bussiness Card",
        components: {
            types: [
                { content: "" }
            ],
            quantities: [
                { quantity: 1, price: 1 }
            ],
            corner: {
                type: "",
                price: 0
            },
            isExistDesign: false,
            isExistLogo: false,
            isAttachAFile: false,
            isDisplayStock: false,
        }
    },
    {
        name: "Flex",
        components: {
            types: [
                { content: "" }
            ],
            dimentionsDetails: [
                { width: 0, height: 0, price: 0 }
            ],
            isAttachAFile: false,
            isDisplayStock: false,
        }
    },
    {
        name: "Panner",
        components: {
            types: [
                { content: "" }
            ],
            dimentionsDetails: [
                { width: 0, height: 0, price: 0 }
            ],
            isAttachAFile: false,
            isDisplayStock: false,
        }
    }
];

// Create Template Model From Template Schema

const templateModel = mongoose.model("template", templateSchema);

async function insert_initial_templates() {
    try {
        await mongoose.connect(process.env.DB_URL);
        await templateModel.insertMany(inititalTemplates);
        await mongoose.disconnect();
        return "Ok !!, Create Initial Templates Process Has Been Successfuly !!";
    } catch(err) {
        await mongoose.disconnect();
        throw Error(err);
    }
}

insert_initial_templates().then((result) => console.log(result));