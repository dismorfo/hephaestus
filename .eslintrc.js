module.exports = {
    "env": {
        "browser": false,
        "node": true,
        "commonjs": true,
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "globals": {
      "Promise": true,
      "Proxy": true
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
