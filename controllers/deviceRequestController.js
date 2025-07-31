const DeviceRequest = require('../models/deviceRequestModel');     // מודל בקשות המכשיר שיצרנו עכשיו
const Device = require('../models/deviceModel');                   // מודל המכשיר, לשימוש בעת אישור

// GET /api/device-requests?status=pending|approved|rejected        // נקודת קצה לשליפת בקשות (עם סינון סטטוס אופציונלי)
const listRequests = async (req, res) => {                         // פונקציה שמחזירה רשימת בקשות
  try {                                                            // בלוק לנסות/לתפוס שגיאות
    const { status } = req.query;                                  // קורא פרמטר סטטוס מהשאילתה (אם נשלח)
    const q = status ? { status } : {};                            // בונה פילטר: אם יש סטטוס – סנן לפיו
    const requests = await DeviceRequest                           // מבצע שליפה מה-DB
      .find(q)                                                     // שולף לפי הפילטר
      .sort({ createdAt: -1 })                                     // ממיין מהחדש לישן
      .populate('requestedBy', 'username role');                   // מוסיף פרטים בסיסיים על המשתמש שביקש

    res.json(requests);                                            // מחזיר את הרשימה ללקוח
  } catch (e) {                                                    // במקרה של שגיאה
    console.error(e);                                              // לוג לשגיאה בשרת
    res.status(500).json({ message: 'Server error' });            // תשובת שגיאה ללקוח
  }
};

// POST /api/device-requests/:id/approve                            // נקודת קצה לאישור בקשה (Admin)
const approveRequest = async (req, res) => {                       // מאשרת בקשה ויוצרת מכשיר בפועל
  try {
    const { id } = req.params;                                     // מזהה הבקשה מה-URL
    const request = await DeviceRequest.findById(id);              // שליפת הבקשה מה-DB
    if (!request) return res.status(404).json({ message: 'Request not found' }); // לא נמצאה בקשה
    if (request.status !== 'pending')                              // מותר לאשר רק אם עדיין ממתינה
      return res.status(400).json({ message: 'Request is not pending' });

    const device = await Device.create({                           // יצירת מכשיר חדש לפי נתוני הבקשה
      name: request.name,                                          // שם המכשיר
      type: request.type,                                          // סוג המכשיר
      roomId: request.roomId                                       // חדר היעד
    });

    request.status = 'approved';                                   // מעדכן סטטוס הבקשה ל"מאושר"
    request.reviewedBy = req.user.id;                              // שומר מי האדמין שאישר (נלקח מה-JWT)
    await request.save();                                          // שמירת הבקשה (updatedAt = זמן האישור)

    res.json({ message: 'Request approved. Device created.', device, request }); // תשובה מפורטת ללקוח
  } catch (e) {
    console.error(e);                                              // לוג לשגיאה
    res.status(500).json({ message: 'Server error' });            // תשובת 500
  }
};

// POST /api/device-requests/:id/reject                             // נקודת קצה לדחיית בקשה (Admin)
const rejectRequest = async (req, res) => {                        // דוחה בקשה קיימת
  try {
    const { id } = req.params;                                     // מזהה הבקשה
    const request = await DeviceRequest.findById(id);              // שליפת הבקשה
    if (!request) return res.status(404).json({ message: 'Request not found' }); // לא נמצאה
    if (request.status !== 'pending')                              // מוודא שהיא ממתינה
      return res.status(400).json({ message: 'Request is not pending' });

    request.status = 'rejected';                                   // מעדכן ל"נדחה"
    request.reviewedBy = req.user.id;                              // מי דחה (Admin)
    await request.save();                                          // שמירה (updatedAt = זמן הדחייה)

    res.json({ message: 'Request rejected.', request });           // מחזיר את הבקשה המעודכנת
  } catch (e) {
    console.error(e);                                              // לוג לשגיאה
    res.status(500).json({ message: 'Server error' });            // שגיאה ללקוח
  }
};

module.exports = { listRequests, approveRequest, rejectRequest };  // מייצא את שלוש הפעולות לשימוש בראוטים
