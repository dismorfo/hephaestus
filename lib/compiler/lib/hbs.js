        /** append all the templates to the body */
        _.each(data.assets.hbs, function (hbs) {
          // HBS templates can be in 4 different folders
          // ------------------------------------------------
          // 1) Current module
          // 2) Current site shared resources
          // 3) Fail

          // 1) Current module
          if (exists(path.join(data.module.current, hbs.template))) {
            hbs.src = path.join(data.module.current, hbs.template);
          }
          // 2) Current site shared resources
          // 3) Javascript file does not exists, continue
          else {
            return;
          }
          data.closure += compile.hbs(hbs);
        });
