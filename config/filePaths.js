const path = require('path');

const baseDir = path.join(__dirname, '..');

module.exports = {
  HOTEL_DOCS_ADD: path.join(baseDir, 'uploads', 'hotel_docs'),
  HOTEL_DOCS_VIEW: `${process.env.FILE_VIEW}/uploads/hotel_docs`,
};
