import translations from '/Portfolio/data/translations.json' with { type: 'json' };
import { languageState } from '/Portfolio/javascript.js';

const lang = translations[languageState.current] || translations.en;

let liveUniqueIframe = null;
let timeoutId = null;
let activeThumb = null;

const youtube = document.querySelector('#youtube .scroll-container');
const agenda = document.querySelector('#agenda .scroll-container');
const twitch = document.querySelector('#twitch .scroll-container');

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

function filterStreams(youtubeData, twitchStreams)
{
    const ScheduledStreams = [];
    const HappeningStreams = [];
    const TwitchStreams = [];

    for (const video of youtubeData) {
        if (video.actualStartTime && !video.actualEndTime) {
            HappeningStreams.push(video);
        } else if (video.scheduledStartTime && !video.actualStartTime) {
            ScheduledStreams.push(video);
        }
    }

    ScheduledStreams.sort((a, b) =>
        new Date(a.scheduledStartTime) - new Date(b.scheduledStartTime)
    );

    HappeningStreams.sort((a, b) =>
        new Date(a.actualStartTime) - new Date(b.actualStartTime)
    );

    for (const stream of twitchStreams) {
        TwitchStreams.push(stream);
    }

    return {ScheduledStreams, HappeningStreams, TwitchStreams};
}

function renderStreams(HappeningStreams, ScheduledStreams, TwitchStreams) 
{
    let youtubeHTML = "";
    let agendaHTML = "";
    let twitchHTML = "";

    HappeningStreams.forEach(stream => {
        try {
            youtubeHTML += `
                <div class="live">
                    <a href="https://www.youtube.com/watch?v=${stream.id}" target="_blank" class="live-thumb">
                        <img src="${stream.thumbnailMax ?? stream.thumbnailHigh} " alt="Channel Pfp">
                    </a>
                    <div class="live-info">
                        <div>
                            <a target="_blank" class="streamtitle" href="https://www.youtube.com/watch?v=${stream.id}">${stream.title}</a>
                        </div>

                        <a target="_blank" class="channelname" href="https://www.youtube.com/channel/${stream.channelId}"> ${stream.channel} </a>
                        <div style="color: white">${stream.concurrentViewers} ${lang.watching_now} </div>
                    </div>
                </div>`

        } catch (err) {
            console.log(err);
        }
    });

    ScheduledStreams.forEach(stream => {
        try {

            let displayText;
            const localCurrentTime = new Date();

            const localStreamHour = new Date(stream.scheduledStartTime);
            const localStreamDate = localStreamHour.toLocaleDateString("pt-BR");

            const localStreamTimeLeftMS = localStreamHour - localCurrentTime;

            const localStreamTimeLeft = localStreamTimeLeftMS / (60 * 60 * 1000);
            const localStreamHoursLeft = Math.floor(localStreamTimeLeft)

            if (localStreamHoursLeft >= 24) {
                displayText = localStreamDate;
            } else if (localStreamHoursLeft > 1) {
                displayText = lang.in + localStreamHoursLeft.toLocaleString() + lang.hours;
            } else if (localStreamHoursLeft === 1){
                displayText = lang.in + localStreamHoursLeft.toLocaleString() + lang.hour;
            }else {
                const localStreamMinutesLeft = Math.floor(localStreamTimeLeft * 60);
                if (localStreamMinutesLeft === 1) {
                    displayText = lang.in_1_minute;
                } else {
                    displayText = lang.in + localStreamMinutesLeft + lang.minutes;
                }
            }

            const localStreamStartTime = new Date(stream.scheduledStartTime).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

            agendaHTML += `
                <div class="live">
                    <a href="https://www.youtube.com/watch?v=${stream.id}" target="_blank" class="live-thumb">
                        <img src="${stream.thumbnailMax ?? stream.thumbnailHigh}" alt="Channel Pfp">
                    </a>
                    <div class="live-info">
                        <div>
                            <a target="_blank" class="streamtitle" href="https://www.youtube.com/watch?v=${stream.id}">${stream.title}</a>
                        </div>

                        <a target="_blank" class="channelname" href="https://www.youtube.com/channel/${stream.channelId}"> ${stream.channel} </a>
                        <div style="color: white"> ${lang.starts} ${displayText} (${localStreamStartTime})</div>
                    </div>
                </div>`
        } catch (err) {
            console.log(err);
        }
    });

    TwitchStreams.forEach(stream => {
        try {
            twitchHTML += `
                <div class="live">
                    <a href="https://www.twitch.tv/${stream.name}" target="_blank" class="live-thumb">
                        <img src="${stream.thumbnail.replace("{width}", "320").replace("{height}", "180")}" alt="Channel Pfp">
                    </a>
                    <div class="live-info">
                        <div>
                            <a target="_blank" class="streamtitle" href="https://www.twitch.tv/${stream.name}">${stream.title}</a>
                    </div>

                        <a target="_blank" class="channelname" href="https://www.twitch.tv/${stream.name}"> ${stream.name} </a>
                        <div style="color: white">${stream.viewers} ${lang.watching_now} </div>
                    </div>
                </div>`
        } catch (err) {
            console.log(err);
        }
    })

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
        const response = await fetch(`https://namastream.migueloliv-dev.workers.dev/v3/youtube`);
        const twitchRes = await fetch(`https://namastream.migueloliv-dev.workers.dev/v3/twitch`);

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

[youtube, agenda, twitch].forEach(bar => {

    bar.addEventListener("mouseover", (event) => {
        const thumb = event.target.closest(".live-thumb");
        if (!thumb) return;

        if (activeThumb === thumb) return;
        activeThumb = thumb;

        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            if (activeThumb !== thumb) return;

            const videoLink = thumb.href;
            if (!videoLink) return;

            const url = new URL(videoLink);
            const videoId = url.searchParams.get("v");
            if (!videoId) return;

            if (liveUniqueIframe) {
                liveUniqueIframe.remove();
                liveUniqueIframe = null;
            }

            const iframe = document.createElement("iframe");
            iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1`;
            liveUniqueIframe = iframe;

            thumb.appendChild(iframe);
        }, 3000);

    }, true);

    bar.addEventListener("mouseout", (event) => {
        const thumb = event.target.closest(".live-thumb");
        if (!thumb) return;

        if (thumb.contains(event.relatedTarget)) return;

        clearTimeout(timeoutId);

        if (activeThumb === thumb) {
            activeThumb = null;

            if (liveUniqueIframe) {
                liveUniqueIframe.remove();
                liveUniqueIframe = null;
            }
        }
    }, true);

});

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
