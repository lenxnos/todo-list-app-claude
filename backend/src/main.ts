import { createApp } from './infrastructure/http/app.js';
import { env } from './infrastructure/config/env.js';

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});
