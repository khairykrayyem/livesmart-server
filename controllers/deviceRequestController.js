const DeviceRequest = require('../models/deviceRequestModel');     
const Device = require('../models/deviceModel');                   

// GET /api/device-requests?status=pending|approved|rejected        // נקודת קצה לשליפת בקשות 
const listRequests = async (req, res) => {                         // פונקציה שמחזירה רשימת בקשות//
  try {                                                            
    const { status } = req.query;                                  
    const q = status ? { status } : {};                            
    const requests = await DeviceRequest                           
      .find(q)                                                     
      .sort({ createdAt: -1 })                                     
      .populate('requestedBy', 'username role');                   

    res.json(requests);                                            
  } catch (e) {                                                    
    console.error(e);                                              
    res.status(500).json({ message: 'Server error' });            
  }
};

// POST /api/device-requests/:id/approve                            // ///נקודת קצה לאישור בקשה (Admin)
const approveRequest = async (req, res) => {                       
  try {
    const { id } = req.params;                                     
    const request = await DeviceRequest.findById(id);              
    if (!request) return res.status(404).json({ message: 'Request not found' }); 
    if (request.status !== 'pending')                              
      return res.status(400).json({ message: 'Request is not pending' });

    const device = await Device.create({                           
      name: request.name,                                          
      type: request.type,                                          
      roomId: request.roomId                                       
    });

    request.status = 'approved';                                   
    request.reviewedBy = req.user.id;                             
    await request.save();                                          

    res.json({ message: 'Request approved. Device created.', device, request }); 
  } catch (e) {
    console.error(e);                                              
    res.status(500).json({ message: 'Server error' });            
  }
};

// POST /api/device-requests/:id/reject                             //// נקודת קצה לדחיית בקשה (Admin)
const rejectRequest = async (req, res) => {                        
  try {
    const { id } = req.params;                                     
    const request = await DeviceRequest.findById(id);              
    if (!request) return res.status(404).json({ message: 'Request not found' }); 
    if (request.status !== 'pending')                              
      return res.status(400).json({ message: 'Request is not pending' });

    request.status = 'rejected';                                   
    request.reviewedBy = req.user.id;                              
    await request.save();                                          

    res.json({ message: 'Request rejected.', request });           /////// מחזיר את הבקשה המעודכנת
  } catch (e) {
    console.error(e);                                             
    res.status(500).json({ message: 'Server error' });        ////// שגיאה ללקוח
  }
};

module.exports = { listRequests, approveRequest, rejectRequest };
