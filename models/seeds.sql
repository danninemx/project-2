-- For deployed DB only.
USE t3pj2wlsyauwuv9g;

-- 
CREATE TABLE guides (
    `id` INT NOT NULL AUTO_INCREMENT,
    `chapterId` INT(5) NOT NULL,
    `chapter` VARCHAR(50) NOT NULL,
    `lessonId` INT(5) NOT NULL,
    `lesson` VARCHAR(100) NOT NULL,
    `paragraph` INT(5) NOT NULL,
    `content` VARCHAR(2000),
    PRIMARY KEY (id)
);

SELECT * FROM guides;


INSERT INTO guides (chapterId, chapter, lessonId, lesson, paragraph, content)
VALUES (1, 'Grammar and Types', 1, 'Basics', 1, '<h2 id="Basics">Basics</h2>');

INSERT INTO guides (chapterId, chapter, lessonId, lesson, paragraph, content)
VALUES (1, 'Grammar and Types', 1, 'Basics', 2, '<p>JavaScript borrows most of its syntax from Java, C and C++, but is also influenced by Awk, Perl and Python.</p>');

INSERT INTO guides (chapterId, chapter, lessonId, lesson, paragraph, content)
VALUES (1, 'Grammar and Types', 1, 'Basics', 3, '<p>JavaScript is <strong>case-sensitive</strong> and uses the <strong>Unicode</strong> character set.</p>');

INSERT INTO guides (chapterId, chapter, lessonId, lesson, paragraph, content)
VALUES (1, 'Grammar and Types', 1, 'Basics', 4, '<p>But, the variable <code>früh</code> is not the same as <code>Früh</code> because JavaScript is case sensitive.</p>');

INSERT INTO guides (chapterId, chapter, lessonId, lesson, paragraph, content)
VALUES (1, 'Grammar and Types', 1, 'Basics', 5, '<p>In JavaScript, instructions are called statements and are separated by semicolons (;).</p>');

INSERT INTO guides (chapterId, chapter, lessonId, lesson, paragraph, content)
VALUES (1, 'Grammar and Types', 1, 'Basics', 6, '<p>A semicolon is not necessary after a statement if it is written on its own line. But if more than one statement on a line is desired, then they must be separated by semicolons. ECMAScript also has rules for automatic insertion of semicolons to end statements. It is considered best practice, however, to always write a semicolon after a statement, even when it is not strictly needed. This practice reduces the chances of bugs getting into the code.</p>');

INSERT INTO guides (chapterId, chapter, lessonId, lesson, paragraph, content)
VALUES (1, 'Grammar and Types', 1, 'Basics', 7, '<p>The source text of JavaScript script gets scanned from left to right and is converted into a sequence of input elements which are tokens, control characters, line terminators, comments, or whitespace. Spaces, tabs, and newline characters are considered whitespace.</p>');




INSERT INTO guides (chapterId, chapter, lessonId, lesson, paragraph, content)
VALUES (1, 'Grammar and Types', 2, 'Comments', 1, '<h2 id="Comments">Comments</h2>');

INSERT INTO guides (chapterId, chapter, lessonId, lesson, paragraph, content)
VALUES (1, 'Grammar and Types', 2, 'Comments', 2, '<p>The syntax of <strong>comments</strong> is the same as in C++ and in many other languages.</p>');

INSERT INTO guides (chapterId, chapter, lessonId, lesson, paragraph, content)
VALUES (1, 'Grammar and Types', 2, 'Comments', 3, '<p>Comments behave like whitespace and are discarded during script execution.</p>');

INSERT INTO guides (chapterId, chapter, lessonId, lesson, paragraph, content)
VALUES (1, 'Grammar and Types', 2, 'Comments', 4, '<code><span>// a one line comment</span>');

INSERT INTO guides (chapterId, chapter, lessonId, lesson, paragraph, content)
VALUES (1, 'Grammar and Types', 2, 'Comments', 5, '<span class="token comment">/* This lets you notate a longer, multi-line comment. */</span>');

INSERT INTO guides (chapterId, chapter, lessonId, lesson, paragraph, content)
VALUES (1, 'Grammar and Types', 2, 'Comments', 6, '<span>// a one line comment</span></code>');

INSERT INTO guides (chapterId, chapter, lessonId, lesson, paragraph, content)
VALUES (1, 'Grammar and Types', 2, 'Comments', 7, '<p><strong>Note</strong>: You might also see a third type of comment syntax at the start of some JavaScript files, along these lines: <code>#!/usr/bin/env node</code>. This is called <strong>hashbang comment</strong> syntax, and is a special comment used to specify the path to a particular JavaScript interpreter that you want to use to execute the script.</p>');




INSERT INTO guides (chapterId, chapter, lessonId, lesson, paragraph, content)
VALUES (1, 'Grammar and Types', 3, 'Declarations', 1, '<h2 id="Declarations">Declarations</h2>');

INSERT INTO guides (chapterId, chapter, lessonId, lesson, paragraph, content)
VALUES (1, 'Grammar and Types', 3, 'Declarations', 2, '<p>When you wish to store values or functions, you would utilize "variables" to hold them.</p>');

INSERT INTO guides (chapterId, chapter, lessonId, lesson, paragraph, content)
VALUES (1, 'Grammar and Types', 3, 'Declarations', 3, '<p>There are three kinds of variable declarations in JavaScript.</p>');

INSERT INTO guides (chapterId, chapter, lessonId, lesson, paragraph, content)
VALUES (1, 'Grammar and Types', 3, 'Declarations', 4, '<p><code>var</code>: Declares a variable, optionally initializing it to a value.</p>');

INSERT INTO guides (chapterId, chapter, lessonId, lesson, paragraph, content)
VALUES (1, 'Grammar and Types', 3, 'Declarations', 5, '<p><code>let</code>: Declares a block-scoped, local variable, optionally initializing it to a value.</p>');

INSERT INTO guides (chapterId, chapter, lessonId, lesson, paragraph, content)
VALUES (1, 'Grammar and Types', 3, 'Declarations', 6, '<p><code>const</code>: Declares a block-scoped, read-only named constant</p>');
