import { videoQueue } from './config/redis';

(async () => {
    const waiting = await videoQueue.getWaiting();
    const active = await videoQueue.getActive();
    const failed = await videoQueue.getFailed();
    
    console.log(`⌛ Waiting jobs: ${waiting.length}`);
    console.log(`🚀 Active jobs: ${active.length}`);
    console.log(`❌ Failed jobs: ${failed.length}`);
})();
