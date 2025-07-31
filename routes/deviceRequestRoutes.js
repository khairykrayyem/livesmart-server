const express = require('express');                                // מייבא Express ליצירת ראוטר
const router = express.Router();                                   // יוצר מופע ראוטר

const { listRequests, approveRequest, rejectRequest } =
  require('../controllers/deviceRequestController');               // מייבא את פעולות הבקר החדשות

const { verifyToken, requireAdmin } =
  require('../middleware/authMiddleware');                         // מייבא אימות JWT ובדיקת Admin
// הערה: אם אצלך הקובץ נקרא אחרת (למשל auth.js) – שנה את הנתיב בהתאם

router.get('/', verifyToken, requireAdmin, listRequests);          // רשימת בקשות – רק למנהל
router.post('/:id/approve', verifyToken, requireAdmin, approveRequest); // אישור בקשה – רק למנהל
router.post('/:id/reject',  verifyToken, requireAdmin, rejectRequest);  // דחיית בקשה – רק למנהל

module.exports = router;                                        // מייצא את הראוטר ל-index.js
