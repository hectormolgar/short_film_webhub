// Anonymous Survey & Statistics System for Web-HUB
window.Survey = {
    storageKey: 'DE_QUIEN_ES_LA_CULPA_VOTES',

    init() {
        console.log("[Survey] Initializing...");
        this.loadVotes();
    },

    getVotes() {
        return JSON.parse(localStorage.getItem(this.storageKey) || '{}');
    },

    vote(qId, option) {
        const votes = this.getVotes();
        if (votes[qId]) {
            console.log("[Survey] User already voted for question:", qId);
            return { success: false, message: 'Ya has registrado tu voto para esta pregunta.' };
        }

        votes[qId] = option;
        localStorage.setItem(this.storageKey, JSON.stringify(votes));
        console.log("[Survey] Vote recorded:", qId, option);
        return { success: true };
    },

    hasVoted(qId) {
        return this.getVotes().hasOwnProperty(qId);
    },

    loadVotes() {
        const votes = this.getVotes();
        for (const qId in votes) {
            this.displayResults(qId);
        }
    },

    displayResults(qId) {
        const results = document.getElementById(`results-${qId}`);
        if (results) {
            results.style.display = 'block';
            const options = results.parentElement.querySelectorAll('.option-btn');
            options.forEach(btn => {
                btn.disabled = true;
                btn.style.opacity = '0.5';
            });

            // Simulate/Show distribution
            const fill = results.querySelector('.results-fill');
            if (fill) {
                // Just for visual effect in beta, we use fixed but realistic-looking percentages
                // In a real app, this would come from a server
            }
        }
    }
};

document.addEventListener('DOMContentLoaded', () => window.Survey.init());
