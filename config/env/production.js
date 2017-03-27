/**
 * Production environment settings
 *
 * This file can include shared settings for a production environment,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the production        *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  // models: {
  //   connection: 'someMysqlServer'
  // },

  /***************************************************************************
   * Set the port in the production environment to 80                        *
   ***************************************************************************/

<<<<<<< HEAD
  port: 85,
  // realHost: "https://rusabeta.wohlig.co.in",
  realHost: "http://rusabeta.wohlig.com",
  emails: ["chintan@wohlig.com", "ashish.zanwar@wohlig.com", "jagruti@wohlig.com", "tushar@wohlig.com", "chirag@wohlig.com", "harsh@wohlig.com", "sohan@wohlig.com", "pratik.gawand@wohlig.com"]
=======
  port: 81,
  // realHost: "https://rusa.wohlig.co.in",
  realHost: "https://rusa.thegraylab.com",
  emails: ["chintan@wohlig.com", "ashish.zanwar@wohlig.com", "jagruti@wohlig.com", "tushar@wohlig.com", "chirag@wohlig.com", "harsh@wohlig.com", "sohan@wohlig.com", "aditya.ghag@wohlig.com"]
>>>>>>> d6851673a5561ceb0120a428087efe46783353ed

  /***************************************************************************
   * Set the log level in production environment to "silent"                 *
   ***************************************************************************/

  // log: {
  //   level: "silent"
  // }

};
