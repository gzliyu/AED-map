# Generated by Django 2.2.12 on 2020-06-09 07:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('m', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Point',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('latitude', models.FloatField()),
                ('longitude', models.FloatField()),
                ('description', models.TextField()),
            ],
        ),
    ]