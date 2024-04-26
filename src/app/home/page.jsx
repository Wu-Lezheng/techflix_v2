import { Suspense } from 'react'
import Sidebar from '@/components/sidebar/Sidebar';
import styles from "./page.module.css"

export default function Home() {

    return (
        <div>
            <Sidebar></Sidebar>
            <Suspense fallback={<p>Loading video...</p>}>
                <VideoComponent fileName="my-video.mp4" />
            </Suspense>
        </div>
    );
}

// TODO: When migrating to remote server, replace the url with the one obtained from remote database or storage, 
// and make this function async
function VideoComponent({ fileName }) {

    const url = "/videos/sample_video_2.mp4";

    return (
        <video width="320" height="240" controls preload="none" aria-label="Video player">
            <source src={url} type="video/mp4" />
            Your browser does not support the video tag.
        </video>
    );
}