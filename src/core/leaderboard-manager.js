export default class LeaderboardManager {
    constructor() {
        this._storageKey = 'haunted-pumpkin-leaderboard';
        this._maxEntries = 10;
    }

    addScore(score, combo = 0) {
        const leaderboard = this.getLeaderboard();

        const entry = {
            score,
            combo,
            date: new Date().toISOString(),
            timestamp: Date.now()
        };

        leaderboard.push(entry);
        leaderboard.sort((a, b) => b.score - a.score);

        // Keep only top entries
        const trimmedLeaderboard = leaderboard.slice(0, this._maxEntries);

        this._saveLeaderboard(trimmedLeaderboard);

        // Return rank (1-based)
        const rank = trimmedLeaderboard.findIndex(e => e.timestamp === entry.timestamp) + 1;
        return {
            rank,
            isNewRecord: rank === 1,
            isTopTen: rank <= 10
        };
    }

    getLeaderboard() {
        try {
            const data = localStorage.getItem(this._storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Failed to load leaderboard:', error);
            return [];
        }
    }

    getHighScore() {
        const leaderboard = this.getLeaderboard();
        return leaderboard.length > 0 ? leaderboard[0].score : 0;
    }

    getRank(score) {
        const leaderboard = this.getLeaderboard();
        const rank = leaderboard.filter(entry => entry.score > score).length + 1;
        return rank;
    }

    isHighScore(score) {
        const highScore = this.getHighScore();
        return score > highScore;
    }

    clearLeaderboard() {
        localStorage.removeItem(this._storageKey);
    }

    _saveLeaderboard(leaderboard) {
        try {
            localStorage.setItem(this._storageKey, JSON.stringify(leaderboard));
        } catch (error) {
            console.error('Failed to save leaderboard:', error);
        }
    }

    formatDate(isoString) {
        const date = new Date(isoString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;

        return date.toLocaleDateString();
    }
}
