/**
 * Menu
 */
async function menu() {
  return;
    /** load/read JSON configure file for each page in project */
    let appPages = path.join(appDir(), 'app/pages');

    // figure this out...
    // TODO: NEED TO FIX THE MENU
    readdirSync(appPages).forEach((page) => {
      let filepath = path.join(appPages, page, 'index.json');
      if (exists(filepath)) {
        pages.push(read.json(filepath));
      }
    });

      /** build the menu object */
    // _.each(pages, (page, index) => {
    //   if (_.isArray(pages[index].menu)) {
    //     _.each(pages[index].menu, (menu) => {
    //       let weight = menu.weight
    //       if (!_.isEmpty(source.menu[weight])) {
    //         weight = source.menu.length + 1
    //       }
    //       source.menu[weight] = {
    //         label: menu.label,
    //         status: 'active',
    //         route: pages[index].route.replace('/index.html', ''),
    //         page: index,
    //         weight: weight
    //       }
    //     })
    //   }
    // })

    /** clean the menu object of empty values that can "exist" becuase of weight */
    // source.menu = _.reject(source.menu, (menu) => {
    //   return _.isUndefined(menu)
    // })
}

module.exports = async function () {
  return await menu();
}
