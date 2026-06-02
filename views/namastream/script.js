import translations from '/Portfolio/data/translations.json' with { type: 'json' };
import { languageState } from '/Portfolio/javascript.js';

const BACKEND_URL = 'https://namastream.migueloliv-dev.workers.dev';

const images = [
    '/Portfolio/images/projects/namastream/namastream-1.jpg',
    '/Portfolio/images/projects/namastream/namastream-2.jpg',
    '/Portfolio/images/projects/namastream/namastream-3.jpg'
];

let currentImageIndex = 0;
let streamsData = {};

// ========== IMAGE VIEWER ==========
function updateImageViewer() {
    const viewerImage = document.getElementById('viewerImage');
    if (viewerImage) {
        viewerImage.src = images[currentImageIndex];
    }

    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentImageIndex);
    });
}

function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    updateImageViewer();
}

function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    updateImageViewer();
}

function goToImage(index) {
    currentImageIndex = index;
    updateImageViewer();
}

// ========== STREAMS BAR ==========

function filterStreams(videosResponse, twitchResponse) {
    const ScheduledStreams = [];
    const HappeningStreams = [];
    const TwitchStreams = [];

    for (const response of videosResponse) {
        for (const video of response.items) {

            if (!video.liveStreamingDetails) continue;

            if (video.liveStreamingDetails.actualStartTime && !video.liveStreamingDetails.actualEndTime) {
                HappeningStreams.push(video);
            } else if (video.liveStreamingDetails.scheduledStartTime && !video.liveStreamingDetails.actualStartTime) {
                ScheduledStreams.push(video);
            }
        }
    }

    ScheduledStreams.sort((a, b) =>
        new Date(a.liveStreamingDetails.scheduledStartTime) - new Date(b.liveStreamingDetails.scheduledStartTime)
    );

    HappeningStreams.sort((a, b) =>
        new Date(a.liveStreamingDetails.actualStartTime) - new Date(b.liveStreamingDetails.actualStartTime)
    );

    for (const response of twitchResponse.data) {
        TwitchStreams.push(response);
    }

    return { ScheduledStreams, HappeningStreams, TwitchStreams };
}

function renderStreams(HappeningStreams, ScheduledStreams, TwitchStreams) {
    const lang = translations[languageState.current] || translations.en;

    const youtube = document.querySelector('#youtube .scroll-container');
    const agenda = document.querySelector('#agenda .scroll-container');
    const twitch = document.querySelector('#twitch .scroll-container');

    if (!youtube || !agenda || !twitch) return;

    let youtubeHTML = '';
    let agendaHTML = '';
    let twitchHTML = '';

    HappeningStreams.forEach(stream => {
        try {
            const viewerCount = stream.liveStreamingDetails.concurrentViewers;
            const watchingText = `${viewerCount} ${lang.watching_now}`;

            youtubeHTML += `
                <div class="live">
                    <a class="live-thumb" href="https://www.youtube.com/watch?v=${stream.id}" target="_blank">
                        <img src="${stream.snippet.thumbnails.maxres?.url ?? stream.snippet.thumbnails.high.url}" alt="Stream">
                    </a>
                    <div class="live-info">
                        <div>
                            <a target="_blank" class="streamtitle" href="https://www.youtube.com/watch?v=${stream.id}">${stream.snippet.title}</a>
                            <a target="_blank" class="channelname" href="https://www.youtube.com/channel/${stream.snippet.channelId}">${stream.snippet.channelTitle}</a>
                        </div>
                        <div>${watchingText}</div>
                    </div>
                </div>`;
        } catch (err) {
            console.log(err);
        }
    });

    ScheduledStreams.forEach(stream => {
        try {
            let displayText;
            const currentTime = new Date();
            const streamTime = new Date(stream.liveStreamingDetails.scheduledStartTime);
            const timeLeftMS = streamTime - currentTime;
            const timeLeftHours = Math.floor(timeLeftMS / (60 * 60 * 1000));

            if (timeLeftHours >= 24) {
                displayText = streamTime.toLocaleDateString(languageState.current);
            } else if (timeLeftHours > 1) {
                displayText = lang.in + timeLeftHours + lang.hours;
            } else if (timeLeftHours === 1) {
                displayText = lang.in + '1' + lang.hour;
            } else {
                const minutesLeft = Math.floor(timeLeftMS / (60 * 1000));
                displayText = minutesLeft === 1 ? lang.in_1_minute : lang.in + minutesLeft + lang.minutes;
            }

            agendaHTML += `
                <div class="live">
                    <a class="live-thumb" href="https://www.youtube.com/watch?v=${stream.id}" target="_blank">
                        <img src="${stream.snippet.thumbnails.maxres?.url ?? stream.snippet.thumbnails.high.url}" alt="Stream">
                    </a>
                    <div class="live-info">
                        <div>
                            <a target="_blank" class="streamtitle" href="https://www.youtube.com/watch?v=${stream.id}">${stream.snippet.title}</a>
                            <a target="_blank" class="channelname" href="https://www.youtube.com/channel/${stream.snippet.channelId}">${stream.snippet.channelTitle}</a>
                        </div>
                        <div>${lang.starts} ${displayText}</div>
                    </div>
                </div>`;
        } catch (err) {
            console.log(err);
        }
    });

    TwitchStreams.forEach(stream => {
        try {
            const viewerCount = stream.viewer_count;
            const watchingText = `${viewerCount} ${lang.watching_now}`;

            twitchHTML += `
                <div class="live">
                    <a class="live-thumb" href="https://www.twitch.tv/${stream.user_name}" target="_blank">
                        <img src="${stream.thumbnail_url.replace('{width}', '320').replace('{height}', '180')}" alt="Stream">
                    </a>
                    <div class="live-info">
                        <div>
                            <a target="_blank" class="streamtitle" href="https://www.twitch.tv/${stream.user_name}">${stream.title}</a>
                            <a target="_blank" class="channelname" href="https://www.twitch.tv/${stream.user_name}">${stream.user_name}</a>
                        </div>
                        <div>${watchingText}</div>
                    </div>
                </div>`;
        } catch (err) {
            console.log(err);
        }
    });

    youtube.innerHTML = youtubeHTML;
    agenda.innerHTML = agendaHTML;
    twitch.innerHTML = twitchHTML;
}

function makeDraggable(bar) {
    let isDragging = false;
    let startPos = 0;
    let scrollStart = 0;

    bar.addEventListener('mousedown', (e) => {
        isDragging = true;
        e.preventDefault();
        startPos = e.pageX;
        scrollStart = bar.scrollLeft;
        bar.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const dist = e.pageX - startPos;
        bar.scrollLeft = scrollStart - dist;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        bar.style.cursor = 'grab';
    });

    bar.addEventListener('wheel', (e) => {
        e.preventDefault();
        const direction = e.deltaY > 0 ? 1 : -1;
        bar.scrollBy({ left: direction * 215, behavior: 'smooth' });
    }, { passive: false });
}

async function loadStreams() {
    try {
        const response = await fetch(`${BACKEND_URL}/v2/youtube`);
        const twitchRes = await fetch(`${BACKEND_URL}/v2/twitch`);

        const videosResponse = await response.json();
        const twitchResponse = await twitchRes.json();

        const data = filterStreams(videosResponse, twitchResponse);
        streamsData = data;
        renderStreams(data.HappeningStreams, data.ScheduledStreams, data.TwitchStreams);

        document.querySelectorAll('.scroll-container').forEach(container => {
            makeDraggable(container);
        });
    } catch (err) {
        console.error('Error loading streams:', err);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateImageViewer();
    loadStreams();

    window.parent.postMessage({ type: 'NAMASTREAM_READY' }, '*');

    document.getElementById('next-btn') ?.addEventListener('click', nextImage);
    document.getElementById('prev-btn') ?.addEventListener('click', prevImage);
});

window.addEventListener('message', (event) => { // Basicamente um handshake, onde ouve um Post e se atualiza, por garantia também fiz re-renderizar, essa bosta

    if (event.data?.type === 'LANGUAGE_CHANGED') {
        languageState.current = event.data.language;

        console.log('Linguagem alterada para:', languageState.current);

        if (streamsData.HappeningStreams || streamsData.ScheduledStreams || streamsData.TwitchStreams) {
            renderStreams(
                streamsData.HappeningStreams ?? [],
                streamsData.ScheduledStreams ?? [],
                streamsData.TwitchStreams ?? []
            );
        }
    }
});
