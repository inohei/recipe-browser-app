class Bookmark {
  Bookmark({required this.url, this.title});

  final String url;
  final String? title;

  Map<String, dynamic> toJson() => {
        'url': url,
        'title': title,
      };

  static Bookmark fromJson(Map<String, dynamic> json) => Bookmark(
        url: json['url'] as String,
        title: json['title'] as String?,
      );
}

