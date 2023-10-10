// {
//   "extends": [
//     "stylelint-config-standard",
//     "stylelint-config-standard-scss"
//   ]
// }


// const propertyGroups = require('stylelint-config-recess-order/groups')

module.exports = {
	extends: ['stylelint-config-standard', 'stylelint-config-standard-scss'],
  ignoreFiles: ['node_modules/**', 'app/assets/builds/**']
};
