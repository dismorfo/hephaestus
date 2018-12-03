module.exports = {
    "env": {
        "browser": false,
        "node": true,
        "commonjs": true,
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 6 
    },
    "rules": {
        "no-console": 0,
        "indent": [
            "error",
           2 
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    }    
};
