import app from './app';
import { Global } from './consts/global';

const port = Global.PORT || 5000;

app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
});
