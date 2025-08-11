class HistoryEntry {
  HistoryEntry({
    required this.url,
    required this.visitedAt,
    this.title,
  });

  final String url;
  final String? title;
  final DateTime visitedAt;

  Map<String, dynamic> toJson() => {
        'url': url,
        'title': title,
        'visitedAt': visitedAt.toIso8601String(),
      };

  static HistoryEntry fromJson(Map<String, dynamic> json) => HistoryEntry(
        url: json['url'] as String,
        title: json['title'] as String?,
        visitedAt: DateTime.parse(json['visitedAt'] as String),
      );
}

