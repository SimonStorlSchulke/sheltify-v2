/** creates user with username 'test' and password 'Test12345678' with corresponding tenant for UI Tests */
INSERT INTO public.tenants (id, created_at, updated_at, deleted_at, name)
VALUES ('test', null, null, null, 'Test');

INSERT INTO public.tenant_configurations (id, created_at, updated_at, deleted_at, tenant_id, name, site_url, cms_show_animal_kind_selector, address, phone_number, email,
                                          article_css, iban, link_paypal, link_facebook, link_instagram, link_tiktok, link_youtube, animal_kinds, animal_stati, blog_categories,
                                          default_animal_kind, last_modified_by, logo_header_id, animal_filter_config_for_animal_kind, animal_feature_where, animal_feature_patrons,
                                          animal_feature_race, animal_feature_animal_kind, last_build, animal_feature_no_adoption, needs_rebuild, animal_show_updates_for_days,
                                          special_article_sections)
VALUES ('a7670550-1415-488d-bddb-d677db507b44', '2025-12-18 20:00:54.114000 +00:00', '2026-03-30 09:05:13.393267 +00:00', null, 'test', 'Testorga', 'http://localhost:4205/', true, e'Teststraße 1
0318 Testingen', '', 'test@test.test', '', 'TEST12348678', '', '', '', '', '', 'Hund,Katze', '', 'News,Wissenswertes', '', '', null, null, true, true, false, true,
        '2026-01-16 12:12:46.519292 +00:00', true, true, 0, null);

INSERT INTO public.users (id, created_at, updated_at, deleted_at, tenant_id, hashed_password, session_token, csrf_token, role, last_modified_by, name, email)
VALUES ('test', '2026-03-30 14:21:00.580566 +00:00', '2026-03-30 14:21:00.580566 +00:00', null, 'test', '$2a$10$9dTz0L4Db9H04yr9AmnFWe4PZZwT2lSpGAPwuT7Kq1UV8ELwW8i8S', null, null,
        'SUPERADMIN', '', 'test', 'test@test.test');
