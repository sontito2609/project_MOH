const isAdmin = (req, res, next) => {
    if (req.session && req.session.isAdmin === true && req.session.userId) {
      return next();
    } else {
      const msg =
        "You must be logged in with admin permission to view this page.";
      return res.redirect(`/auth/login?msg=${msg}`);
    }
  };
  const isWriter = (req, res, next) => {
    if (req.session && req.session.isWriter === true && req.session.userId) {
      return next();
    } else {
      const msg =
        "You must be logged in with Writer permission to view this page.";
      return res.redirect(`/auth/login?msg=${msg}`);
    }
  };

  module.exports = { isAdmin, isWriter };
  