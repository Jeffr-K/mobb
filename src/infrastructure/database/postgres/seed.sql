-- src/database/seeds/categories.sql
-- 상위 카테고리 삽입
INSERT INTO category (name, parent_id) VALUES ('개발', NULL);
INSERT INTO category (name, parent_id) VALUES ('커리어', NULL);
INSERT INTO category (name, parent_id) VALUES ('스킬', NULL);
INSERT INTO category (name, parent_id) VALUES ('커뮤니티', NULL);
INSERT INTO category (name, parent_id) VALUES ('라이프', NULL);

-- 개발 하위 카테고리
INSERT INTO category (name, parent_id)
SELECT '프론트엔드', id FROM category WHERE name = '개발' AND parent_id IS NULL;
INSERT INTO category (name, parent_id)
SELECT '백엔드', id FROM category WHERE name = '개발' AND parent_id IS NULL;
INSERT INTO category (name, parent_id)
SELECT '데브옵스', id FROM category WHERE name = '개발' AND parent_id IS NULL;
INSERT INTO category (name, parent_id)
SELECT '모바일', id FROM category WHERE name = '개발' AND parent_id IS NULL;
INSERT INTO category (name, parent_id)
SELECT '블록체인', id FROM category WHERE name = '개발' AND parent_id IS NULL;

-- 커리어 하위 카테고리
INSERT INTO category (name, parent_id)
SELECT '취업', id FROM category WHERE name = '커리어' AND parent_id IS NULL;
INSERT INTO category (name, parent_id)
SELECT '이직', id FROM category WHERE name = '커리어' AND parent_id IS NULL;
INSERT INTO category (name, parent_id)
SELECT '면접', id FROM category WHERE name = '커리어' AND parent_id IS NULL;
INSERT INTO category (name, parent_id)
SELECT '회사생활', id FROM category WHERE name = '커리어' AND parent_id IS NULL;
INSERT INTO category (name, parent_id)
SELECT '연봉', id FROM category WHERE name = '커리어' AND parent_id IS NULL;

-- 스킬 하위 카테고리
INSERT INTO category (name, parent_id)
SELECT '알고리즘', id FROM category WHERE name = '스킬' AND parent_id IS NULL;
INSERT INTO category (name, parent_id)
SELECT 'CS지식', id FROM category WHERE name = '스킬' AND parent_id IS NULL;
INSERT INTO category (name, parent_id)
SELECT '클라우드', id FROM category WHERE name = '스킬' AND parent_id IS NULL;
INSERT INTO category (name, parent_id)
SELECT '데이터베이스', id FROM category WHERE name = '스킬' AND parent_id IS NULL;
INSERT INTO category (name, parent_id)
SELECT '보안', id FROM category WHERE name = '스킬' AND parent_id IS NULL;

-- 커뮤니티 하위 카테고리
INSERT INTO category (name, parent_id)
SELECT '질문/답변', id FROM category WHERE name = '커뮤니티' AND parent_id IS NULL;
INSERT INTO category (name, parent_id)
SELECT '프로젝트', id FROM category WHERE name = '커뮤니티' AND parent_id IS NULL;
INSERT INTO category (name, parent_id)
SELECT '스터디', id FROM category WHERE name = '커뮤니티' AND parent_id IS NULL;
INSERT INTO category (name, parent_id)
SELECT '네트워킹', id FROM category WHERE name = '커뮤니티' AND parent_id IS NULL;
INSERT INTO category (name, parent_id)
SELECT '모각코', id FROM category WHERE name = '커뮤니티' AND parent_id IS NULL;

-- 라이프 하위 카테고리
INSERT INTO category (name, parent_id)
SELECT '개발자일상', id FROM category WHERE name = '라이프' AND parent_id IS NULL;
INSERT INTO category (name, parent_id)
SELECT '취미', id FROM category WHERE name = '라이프' AND parent_id IS NULL;
INSERT INTO category (name, parent_id)
SELECT '건강', id FROM category WHERE name = '라이프' AND parent_id IS NULL;
INSERT INTO category (name, parent_id)
SELECT '리뷰', id FROM category WHERE name = '라이프' AND parent_id IS NULL;
INSERT INTO category (name, parent_id)
SELECT '잡담', id FROM category WHERE name = '라이프' AND parent_id IS NULL;
