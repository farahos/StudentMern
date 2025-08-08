import expres from 'express';
import { loginUser, registerUser } from '../controller/UserController.js';


const userRouter = expres.Router();
userRouter.post('/registerUser', registerUser);
userRouter.post('/loginUser', loginUser);
export default userRouter;
